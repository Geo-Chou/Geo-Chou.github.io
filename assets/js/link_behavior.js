(function () {
    'use strict';

    var mainSiteHosts = new Set(['geo-zhou.com', 'www.geo-zhou.com']);
    var absoluteWebUrlPattern = /^(?:https?:)?\/\//i;

    function setInternalLinkAttributes(link) {
        link.setAttribute('target', '_self');

        var rel = (link.getAttribute('rel') || '')
            .split(/\s+/)
            .filter(function (value) {
                return value && value !== 'noopener' && value !== 'noreferrer';
            });

        if (rel.length) {
            link.setAttribute('rel', rel.join(' '));
        } else {
            link.removeAttribute('rel');
        }
    }

    function applyLinkBehavior(link) {
        var href = link.getAttribute('href');
        if (!href) return;

        var url;
        try {
            url = new URL(href, window.location.href);
        } catch (error) {
            return;
        }

        var isWebLink = url.protocol === 'http:' || url.protocol === 'https:';
        var isRelativeLink = !absoluteWebUrlPattern.test(href);
        var isMainSiteLink = mainSiteHosts.has(url.hostname.toLowerCase());

        if (!isWebLink || isRelativeLink || isMainSiteLink) {
            setInternalLinkAttributes(link);
            return;
        }

        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    }

    function applyWithin(root) {
        if (root.matches && root.matches('a[href]')) {
            applyLinkBehavior(root);
        }
        if (root.querySelectorAll) {
            root.querySelectorAll('a[href]').forEach(applyLinkBehavior);
        }
    }

    applyWithin(document);

    new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (node) {
                if (node.nodeType === Node.ELEMENT_NODE) applyWithin(node);
            });
        });
    }).observe(document.documentElement, { childList: true, subtree: true });
})();
