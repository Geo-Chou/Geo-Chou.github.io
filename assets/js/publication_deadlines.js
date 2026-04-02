(function () {
    function initConferenceDeadlines() {
        var root = document.getElementById('conference-deadlines');
        if (!root) {
            return;
        }

        var rawItems = root.getAttribute('data-deadline-items');
        if (!rawItems) {
            return;
        }

        var items;
        try {
            items = JSON.parse(rawItems);
        } catch (error) {
            console.error('Failed to parse conference deadline data.', error);
            return;
        }

        var listEl = root.querySelector('[data-deadline-list]');
        var summaryEl = root.querySelector('[data-deadline-summary]');
        var emptyEl = root.querySelector('[data-deadline-empty]');
        var counterEl = root.querySelector('[data-deadline-counter]');
        var detailsEl = root.querySelector('[data-deadline-details]');
        var toggleEl = root.querySelector('[data-deadline-toggle]');
        var toggleLabelEl = root.querySelector('[data-deadline-toggle-label]');
        var viewButtons = root.querySelectorAll('[data-view-filter]');
        var tagButtons = root.querySelectorAll('[data-tag-filter]');

        var state = {
            view: root.getAttribute('data-default-view') || 'upcoming',
            tag: root.getAttribute('data-default-tag') || 'all',
            expanded: root.getAttribute('data-default-expanded') === 'true'
        };
        var resizeTimer = null;
        var activeTooltip = null;

        var milestoneTypeMeta = {
            abstract: { label: 'Abstract', className: 'is-abstract' },
            submission: { label: 'Submission', className: 'is-submission' },
            rebuttal: { label: 'Rebuttal', className: 'is-rebuttal' },
            decision: { label: 'Decision', className: 'is-decision' },
            conference: { label: 'Conference', className: 'is-conference' }
        };
        var timezoneMap = {
            CET: 'Europe/Paris',
            CEST: 'Europe/Paris',
            PT: 'America/Los_Angeles',
            PST: 'America/Los_Angeles',
            PDT: 'America/Los_Angeles',
            ET: 'America/New_York',
            EST: 'America/New_York',
            EDT: 'America/New_York',
            JST: 'Asia/Tokyo',
            UTC: 'UTC'
        };

        function normalizeItem(item) {
            var deadlineDate = new Date(item.deadline);
            var milestones = (item.milestones || []).map(function (milestone) {
                var date = new Date(milestone.date);
                return Object.assign({}, milestone, {
                    type: milestone.type || 'submission',
                    label: milestone.label || ((milestoneTypeMeta[milestone.type || 'submission'] || milestoneTypeMeta.submission).label),
                    rawDate: milestone.date,
                    date: date,
                    time: date.getTime(),
                    isPast: date.getTime() < Date.now()
                });
            });

            if (!milestones.length && item.deadline) {
                milestones.push({
                    type: 'submission',
                    label: 'Submission',
                    rawDate: item.deadline,
                    date: deadlineDate,
                    time: deadlineDate.getTime(),
                    isPast: deadlineDate.getTime() < Date.now()
                });
            }

            milestones.sort(function (a, b) {
                return a.time - b.time;
            });

            var primaryDate = milestones.length ? milestones[0].date : deadlineDate;
            var finalDate = milestones.length ? milestones[milestones.length - 1].date : deadlineDate;
            return Object.assign({}, item, {
                deadlineDate: primaryDate,
                deadlineTime: primaryDate.getTime(),
                finalDate: finalDate,
                finalTime: finalDate.getTime(),
                isPast: milestones.length ? milestones[milestones.length - 1].isPast : deadlineDate.getTime() < Date.now(),
                milestones: milestones
            });
        }

        function getBrowserTimezoneLabel(date) {
            var parts = new Intl.DateTimeFormat(undefined, {
                timeZoneName: 'short'
            }).formatToParts(date);

            var timezonePart = parts.find(function (part) {
                return part.type === 'timeZoneName';
            });

            return timezonePart ? timezonePart.value : Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        }

        function formatDeadline(date) {
            var formatter = new Intl.DateTimeFormat(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                timeZoneName: 'short'
            });

            return formatter.format(date);
        }

        function formatLocalDateTime(date) {
            return new Intl.DateTimeFormat(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                timeZoneName: 'short'
            }).format(date);
        }

        function formatInNamedTimezone(date, timezoneLabel) {
            if (!timezoneLabel) {
                return formatLocalDateTime(date);
            }

            var timeZone = timezoneMap[timezoneLabel] || timezoneLabel;
            try {
                return new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                    timeZone: timeZone,
                    timeZoneName: 'short'
                }).format(date);
            } catch (error) {
                return formatLocalDateTime(date);
            }
        }

        function formatSourceDateTime(rawDate, date, timezoneLabel) {
            if (timezoneLabel === 'AoE' && rawDate) {
                var parsed = formatOffsetDateTime(rawDate, date).text;
                return parsed.replace(/([+-]\d{2}:\d{2}|UTC)$/, 'AoE');
            }

            return formatInNamedTimezone(date, timezoneLabel);
        }

        function formatOffsetDateTime(dateString, fallbackDate) {
            if (!dateString) {
                return {
                    text: formatLocalDateTime(fallbackDate),
                    label: 'Source'
                };
            }

            var match = String(dateString).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?([+-]\d{2}:\d{2}|Z)$/);
            if (!match) {
                return {
                    text: formatLocalDateTime(new Date(dateString)),
                    label: 'Source'
                };
            }

            var year = match[1];
            var month = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(Number(year), Number(match[2]) - 1, 1)));
            var day = String(Number(match[3]));
            var hour24 = Number(match[4]);
            var minute = match[5];
            var offset = match[7];
            var period = hour24 >= 12 ? 'PM' : 'AM';
            var hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
            var label = offset === 'Z' ? 'UTC' : offset;

            return {
                text: month + ' ' + day + ', ' + year + ' at ' + hour12 + ':' + minute + ' ' + period + ' ' + label,
                label: label
            };
        }

        function getRelativeDetailedLabel(date) {
            var diff = date.getTime() - Date.now();
            var abs = Math.abs(diff);
            var dayMs = 24 * 60 * 60 * 1000;
            var hourMs = 60 * 60 * 1000;
            var days = Math.floor(abs / dayMs);
            var hours = Math.floor((abs % dayMs) / hourMs);
            return (diff >= 0 ? 'T+' : 'T-') + days + 'd ' + hours + 'h';
        }

        function getRelativeLabel(item) {
            var now = Date.now();
            var diff = item.deadlineTime - now;
            var absDiff = Math.abs(diff);
            var dayMs = 24 * 60 * 60 * 1000;
            var hourMs = 60 * 60 * 1000;

            if (absDiff < hourMs) {
                return diff >= 0 ? 'Less than 1 hour left' : 'Closed within the last hour';
            }

            if (absDiff < dayMs) {
                var hours = Math.round(absDiff / hourMs);
                return diff >= 0 ? hours + 'h left' : hours + 'h ago';
            }

            var days = Math.ceil(absDiff / dayMs);
            return diff >= 0 ? days + ' days left' : days + ' days ago';
        }

        function getMonthLabel(date) {
            return new Intl.DateTimeFormat(undefined, {
                year: 'numeric',
                month: 'long'
            }).format(date);
        }

        function escapeHtml(value) {
            return String(value)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        function getTooltipElement() {
            var tooltip = document.getElementById('conference-ddl-floating-tooltip');
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.id = 'conference-ddl-floating-tooltip';
                tooltip.className = 'conference-ddl-floating-tooltip';
                document.body.appendChild(tooltip);
            }
            return tooltip;
        }

        function hideFloatingTooltip() {
            var tooltip = getTooltipElement();
            tooltip.classList.remove('is-visible');
            activeTooltip = null;
        }

        function positionFloatingTooltip(trigger, tooltip) {
            var rect = trigger.getBoundingClientRect();
            var tooltipRect = tooltip.getBoundingClientRect();
            var top = rect.top - tooltipRect.height - 12;
            var left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

            if (top < 12) {
                top = rect.bottom + 12;
                tooltip.classList.add('is-below');
            } else {
                tooltip.classList.remove('is-below');
            }

            left = Math.max(12, Math.min(left, window.innerWidth - tooltipRect.width - 12));
            tooltip.style.top = top + 'px';
            tooltip.style.left = left + 'px';
        }

        function showFloatingTooltip(trigger) {
            var tooltip = getTooltipElement();
            var payload = {};
            try {
                payload = JSON.parse(trigger.getAttribute('data-tooltip-payload') || '{}');
            } catch (error) {
                payload = {};
            }

            tooltip.innerHTML = [
                payload.conference ? '<div class="conference-ddl-timeline-bubble-title-small">' + escapeHtml(payload.conference) + '</div>' : '',
                payload.label ? '<div class="conference-ddl-timeline-bubble-stage">' + escapeHtml(payload.label) + '</div>' : '',
                payload.meta_lines && payload.meta_lines.length ? '<div class="conference-ddl-timeline-bubble-meta-lines">' + payload.meta_lines.map(function (line) {
                    return '<div>' + escapeHtml(line) + '</div>';
                }).join('') + '</div>' : '',
                payload.note ? '<div class="conference-ddl-timeline-bubble-note">' + escapeHtml(payload.note) + '</div>' : ''
            ].join('');
            tooltip.classList.add('is-visible');
            positionFloatingTooltip(trigger, tooltip);
            activeTooltip = trigger;
        }

        function attachFloatingTooltipEvents() {
            var dots = root.querySelectorAll('.conference-ddl-timeline-dot[data-tooltip-payload]');
            dots.forEach(function (dot) {
                dot.addEventListener('mouseenter', function () {
                    showFloatingTooltip(dot);
                });
                dot.addEventListener('focus', function () {
                    showFloatingTooltip(dot);
                });
                dot.addEventListener('mouseleave', hideFloatingTooltip);
                dot.addEventListener('blur', hideFloatingTooltip);
            });
        }

        function setExpanded(expanded) {
            state.expanded = expanded;
            detailsEl.classList.toggle('d-none', !expanded);
            root.classList.toggle('is-expanded', expanded);
            toggleEl.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            toggleLabelEl.textContent = expanded ? 'Collapse details' : 'Expand details';
        }

        function startOfMonth(date) {
            return new Date(date.getFullYear(), date.getMonth(), 1);
        }

        function endOfMonth(date) {
            return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
        }

        function addMonths(date, offset) {
            return new Date(date.getFullYear(), date.getMonth() + offset, 1);
        }

        function buildMonthTicks(startDate, endDate) {
            var ticks = [];
            var cursor = startOfMonth(startDate);

            while (cursor <= endDate) {
                ticks.push(new Date(cursor));
                cursor = addMonths(cursor, 1);
            }

            return ticks;
        }

        function buildMinorTicks(startDate, endDate) {
            var ticks = [];
            var cursor = new Date(startDate);

            while (cursor <= endDate) {
                ticks.push(new Date(cursor));
                cursor.setDate(cursor.getDate() + 14);
            }

            return ticks;
        }

        function renderSummary(itemsToRender) {
            if (!itemsToRender.length) {
                summaryEl.innerHTML = '<div class="conference-ddl-summary-empty">No deadlines match the current filters.</div>';
                return;
            }

            var sortedItems = itemsToRender.slice().sort(function (a, b) {
                return a.deadlineTime - b.deadlineTime;
            });
            var firstDate = sortedItems.reduce(function (minDate, item) {
                return item.deadlineTime < minDate.getTime() ? item.deadlineDate : minDate;
            }, sortedItems[0].deadlineDate);
            var lastDate = sortedItems.reduce(function (maxDate, item) {
                return item.finalTime > maxDate.getTime() ? item.finalDate : maxDate;
            }, sortedItems[0].finalDate || sortedItems[0].deadlineDate);
            var rangeStart = addMonths(startOfMonth(firstDate), -1);
            var rangeEnd = endOfMonth(addMonths(startOfMonth(lastDate), 1));
            var totalDays = Math.max(1, Math.ceil((rangeEnd.getTime() - rangeStart.getTime()) / (24 * 60 * 60 * 1000)));
            var dayWidth = 8;
            var labelWidth = window.innerWidth <= 767.98 ? 100 : 124;
            var availableWidth = Math.max(0, summaryEl.clientWidth - labelWidth - 24);
            var timelineWidth = Math.max(availableWidth, totalDays * dayWidth, 960);
            var surfaceWidth = labelWidth + timelineWidth;
            var gridStyle = 'style="grid-template-columns:' + labelWidth + 'px ' + timelineWidth + 'px"';
            var monthTicks = buildMonthTicks(rangeStart, rangeEnd);
            var minorTicks = buildMinorTicks(rangeStart, rangeEnd);
            var now = new Date();
            var nowPosition = ((now.getTime() - rangeStart.getTime()) / (rangeEnd.getTime() - rangeStart.getTime())) * timelineWidth;

            var minorTickHtml = minorTicks.map(function (tick) {
                var left = ((tick.getTime() - rangeStart.getTime()) / (rangeEnd.getTime() - rangeStart.getTime())) * timelineWidth;
                return '<div class="conference-ddl-axis-minor" style="left:' + left + 'px"></div>';
            }).join('');

            var monthHtml = monthTicks.map(function (tick) {
                var left = ((tick.getTime() - rangeStart.getTime()) / (rangeEnd.getTime() - rangeStart.getTime())) * timelineWidth;
                var label = new Intl.DateTimeFormat(undefined, {
                    month: 'short',
                    year: 'numeric'
                }).format(tick);
                return '<div class="conference-ddl-axis-month" style="left:' + left + 'px">' + escapeHtml(label) + '</div>';
            }).join('');

            var rowsHtml = sortedItems.map(function (item) {
                var tags = (item.tags || []).slice(0, 2).map(function (tag) {
                    return '<span class="conference-ddl-summary-tag">' + escapeHtml(tag) + '</span>';
                }).join('');
                var groupedMilestones = {};
                item.milestones.forEach(function (milestone) {
                    var type = milestone.type || 'submission';
                    if (!groupedMilestones[type]) {
                        groupedMilestones[type] = [];
                    }
                    groupedMilestones[type].push(milestone);
                });

                var segmentHtml = Object.keys(groupedMilestones).map(function (type) {
                    var milestones = groupedMilestones[type];
                    if (!milestones || milestones.length < 2 || ['submission', 'rebuttal', 'decision'].indexOf(type) === -1) {
                        return '';
                    }

                    var meta = milestoneTypeMeta[type] || milestoneTypeMeta.submission;
                    var start = ((milestones[0].time - rangeStart.getTime()) / (rangeEnd.getTime() - rangeStart.getTime())) * timelineWidth;
                    var end = ((milestones[milestones.length - 1].time - rangeStart.getTime()) / (rangeEnd.getTime() - rangeStart.getTime())) * timelineWidth;
                    return '<div class="conference-ddl-timeline-segment ' + meta.className + '" style="left:' + start + 'px; width:' + Math.max(0, end - start) + 'px"></div>';
                }).join('');

                var pointsHtml = item.milestones.map(function (milestone) {
                    var position = ((milestone.time - rangeStart.getTime()) / (rangeEnd.getTime() - rangeStart.getTime())) * timelineWidth;
                    var meta = milestoneTypeMeta[milestone.type] || milestoneTypeMeta.submission;
                    var displayLabel = milestone.label || meta.label;
                    var typeMilestones = groupedMilestones[milestone.type || 'submission'] || [];
                    var emphasizeType = ['submission', 'rebuttal', 'decision'].indexOf(milestone.type || 'submission') !== -1;
                    var isPrimaryOfType = emphasizeType && typeMilestones.length && typeMilestones[0] === milestone;
                    var sourceDateText = formatSourceDateTime(milestone.rawDate || milestone.date_raw || milestone.raw_date || milestone.original_date || milestone.source_date || milestone.date_source, milestone.date, item.timezone || 'UTC');
                    var localDateText = formatLocalDateTime(milestone.date);
                    var tooltipPayload = {
                        conference: item.name,
                        label: displayLabel,
                        meta_lines: [
                            (item.timezone || 'Source') + ' \u00b7 ' + sourceDateText,
                            (Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local') + ' \u00b7 ' + localDateText,
                            getRelativeDetailedLabel(milestone.date)
                        ],
                        note: item.note || ''
                    };

                    return [
                        '<div class="conference-ddl-timeline-point ' + meta.className + (milestone.isPast ? ' is-past' : '') + (emphasizeType ? (isPrimaryOfType ? ' is-primary' : ' is-secondary') : '') + '" style="left:' + position + 'px">',
                        '<button type="button" class="conference-ddl-timeline-dot" aria-label="' + escapeHtml(item.name + ' ' + displayLabel) + '" data-tooltip-payload="' + escapeHtml(JSON.stringify(tooltipPayload)) + '"></button>',
                        '</div>'
                    ].join('');
                }).join('');

                return [
                    '<div class="conference-ddl-timeline-row' + (item.highlight ? ' is-highlight' : '') + '" ' + gridStyle + '>',
                    '<div class="conference-ddl-timeline-label">',
                    '<div class="conference-ddl-timeline-name">' + escapeHtml(item.name) + '</div>',
                    '<div class="conference-ddl-timeline-subline">',
                    tags,
                    '<span class="conference-ddl-summary-source">' + escapeHtml(getRelativeLabel(item)) + '</span>',
                    '</div>',
                    '</div>',
                    '<div class="conference-ddl-timeline-track" style="width:' + timelineWidth + 'px">',
                    minorTickHtml,
                    '<div class="conference-ddl-timeline-line" style="width:' + timelineWidth + 'px"></div>',
                    segmentHtml,
                    pointsHtml,
                    '</div>',
                    '</div>'
                ].join('');
            }).join('');

            summaryEl.innerHTML = [
                '<div class="conference-ddl-summary-header">',
                '<div class="conference-ddl-summary-legend">',
                '<span><i class="conference-ddl-legend-dot is-abstract"></i>Abstract</span>',
                '<span><i class="conference-ddl-legend-dot is-submission"></i>Submission</span>',
                '<span><i class="conference-ddl-legend-dot is-rebuttal"></i>Rebuttal</span>',
                '<span><i class="conference-ddl-legend-dot is-decision"></i>Decision</span>',
                '<span><i class="conference-ddl-legend-dot is-conference"></i>Conference</span>',
                '<span><i class="conference-ddl-legend-line"></i>Drag horizontally to scan all venues</span>',
                '</div>',
                '</div>',
                '<div class="conference-ddl-timeline-scroll" data-deadline-scroll>',
                '<div class="conference-ddl-timeline-surface" style="width:' + surfaceWidth + 'px; min-width:100%;">',
                '<div class="conference-ddl-axis" ' + gridStyle + '>',
                '<div class="conference-ddl-axis-label">Venue</div>',
                '<div class="conference-ddl-axis-track" style="width:' + timelineWidth + 'px">',
                '<div class="conference-ddl-axis-line" style="width:' + timelineWidth + 'px"></div>',
                minorTickHtml,
                monthHtml,
                (nowPosition >= 0 && nowPosition <= timelineWidth ? '<div class="conference-ddl-axis-now" style="left:' + nowPosition + 'px"><span>Today</span></div>' : ''),
                '</div>',
                '</div>',
                '<div class="conference-ddl-timeline-rows" style="width:' + surfaceWidth + 'px; min-width:100%;">',
                (nowPosition >= 0 && nowPosition <= timelineWidth ? '<div class="conference-ddl-rows-now" style="left:' + (labelWidth + nowPosition) + 'px"></div>' : ''),
                rowsHtml,
                '</div>',
                '</div>',
                '</div>'
            ].join('');

            attachTimelineInteractions();
            attachFloatingTooltipEvents();
        }

        function attachTimelineInteractions() {
            var scrollEl = root.querySelector('[data-deadline-scroll]');
            if (!scrollEl || scrollEl.dataset.dragBound === 'true') {
                return;
            }

            var isPointerDown = false;
            var startX = 0;
            var startScrollLeft = 0;

            scrollEl.dataset.dragBound = 'true';
            scrollEl.scrollLeft = Math.max(0, nowPositionForScroll(scrollEl));

            scrollEl.addEventListener('pointerdown', function (event) {
                isPointerDown = true;
                startX = event.clientX;
                startScrollLeft = scrollEl.scrollLeft;
                scrollEl.classList.add('is-dragging');
                scrollEl.setPointerCapture(event.pointerId);
            });

            scrollEl.addEventListener('pointermove', function (event) {
                if (!isPointerDown) {
                    return;
                }

                scrollEl.scrollLeft = startScrollLeft - (event.clientX - startX);
            });

            ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (eventName) {
                scrollEl.addEventListener(eventName, function (event) {
                    isPointerDown = false;
                    scrollEl.classList.remove('is-dragging');
                    if (event.pointerId !== undefined && scrollEl.hasPointerCapture && scrollEl.hasPointerCapture(event.pointerId)) {
                        scrollEl.releasePointerCapture(event.pointerId);
                    }
                });
            });
        }

        function nowPositionForScroll(scrollEl) {
            var axisNow = root.querySelector('.conference-ddl-axis-now');
            if (!axisNow) {
                return 0;
            }

            var desired = axisNow.offsetLeft - (scrollEl.clientWidth * 0.35);
            return desired;
        }

        function updateButtonState(buttons, key, value) {
            buttons.forEach(function (button) {
                button.classList.toggle('is-active', button.getAttribute(key) === value);
            });
        }

        function render() {
            var normalizedItems = items.map(normalizeItem).sort(function (a, b) {
                return a.deadlineTime - b.deadlineTime;
            });

            var filteredItems = normalizedItems.filter(function (item) {
                var tagMatch = state.tag === 'all' || ((item.tags || []).indexOf(state.tag) !== -1);
                var viewMatch = true;

                if (state.view === 'upcoming') {
                    viewMatch = !item.isPast;
                } else if (state.view === 'archived') {
                    viewMatch = item.isPast;
                }

                return tagMatch && viewMatch;
            });

            updateButtonState(viewButtons, 'data-view-filter', state.view);
            updateButtonState(tagButtons, 'data-tag-filter', state.tag);

            counterEl.textContent = filteredItems.length + ' deadlines';
            emptyEl.classList.toggle('d-none', filteredItems.length > 0);
            renderSummary(filteredItems);

            if (!filteredItems.length) {
                listEl.innerHTML = '';
                return;
            }

            var html = '';
            var currentMonth = '';

            filteredItems.forEach(function (item) {
                var monthLabel = getMonthLabel(item.deadlineDate);
                if (monthLabel !== currentMonth) {
                    currentMonth = monthLabel;
                    html += '<div class="conference-ddl-month">' + escapeHtml(currentMonth) + '</div>';
                }

                var tags = (item.tags || []).map(function (tag) {
                    return '<span class="conference-ddl-chip">' + escapeHtml(tag) + '</span>';
                }).join('');

                html += [
                    '<article class="conference-ddl-item' + (item.highlight ? ' is-highlight' : '') + '">',
                    '<div class="conference-ddl-marker"></div>',
                    '<div class="conference-ddl-content">',
                    '<div class="conference-ddl-row">',
                    '<div>',
                    '<h3 class="conference-ddl-item-title mb-1">' + escapeHtml(item.name) + '</h3>',
                    '<div class="conference-ddl-venue">' + escapeHtml(item.venue || '') + '</div>',
                    '</div>',
                    '<div class="conference-ddl-status' + (item.isPast ? ' is-past' : '') + '">' + escapeHtml(getRelativeLabel(item)) + '</div>',
                    '</div>',
                    '<div class="conference-ddl-deadline">' + escapeHtml(formatDeadline(item.deadlineDate)) + '</div>',
                    item.note ? '<p class="conference-ddl-note mb-2">' + escapeHtml(item.note) + '</p>' : '',
                    '<div class="conference-ddl-footer">',
                    '<div class="conference-ddl-chips">' + tags + '</div>',
                    '<div class="conference-ddl-links">',
                    item.timezone ? '<span class="conference-ddl-source-timezone">Source ' + escapeHtml(item.timezone) + '</span>' : '',
                    item.location ? '<span class="conference-ddl-location"><i class="fas fa-location-dot mr-1"></i>' + escapeHtml(item.location) + '</span>' : '',
                    item.url ? '<a href="' + escapeHtml(item.url) + '" target="_blank" rel="noreferrer">Website</a>' : '',
                    '</div>',
                    '</div>',
                    '</div>',
                    '</article>'
                ].join('');
            });

            listEl.innerHTML = html;
        }

        viewButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                state.view = button.getAttribute('data-view-filter');
                render();
            });
        });

        tagButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                state.tag = button.getAttribute('data-tag-filter');
                render();
            });
        });

        toggleEl.addEventListener('click', function () {
            setExpanded(!state.expanded);
        });

        window.addEventListener('resize', function () {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(render, 120);
            if (activeTooltip) {
                showFloatingTooltip(activeTooltip);
            }
        });

        document.addEventListener('scroll', function () {
            if (activeTooltip) {
                showFloatingTooltip(activeTooltip);
            }
        }, true);

        setExpanded(state.expanded);
        render();
    }

    document.addEventListener('DOMContentLoaded', initConferenceDeadlines);
})();
