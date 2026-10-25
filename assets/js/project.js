// Keep authoring in Markdown: each top-level h2 starts a card, and standalone
// links to video files become players. Without JS the content and links still work.
document.querySelectorAll('[data-project-body]').forEach(function (body) {
    var cards = document.createDocumentFragment();
    var card;
    Array.from(body.childNodes).forEach(function (node) {
        if (!card && node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
        if (!card || node.nodeName === 'H2') {
            card = document.createElement('section');
            card.className = 'project-surface project-content-card';
            cards.appendChild(card);
        }
        card.appendChild(node);
    });
    body.classList.remove('project-surface', 'project-content-card');
    body.appendChild(cards);

    body.querySelectorAll('p > a:only-child').forEach(function (link) {
        var paragraph = link.parentElement;
        // Inline links with surrounding prose remain ordinary links.
        if (paragraph.textContent.trim() !== link.textContent.trim()) return;
        var url = new URL(link.href, document.baseURI);
        if (!/^https?:$/.test(url.protocol) || !/\.(mp4|webm|ogv|ogg)$/i.test(url.pathname)) return;

        var video = document.createElement('video');
        video.className = 'project-video';
        video.controls = true;
        video.playsInline = true;
        video.preload = 'metadata';
        video.src = url.href;
        video.setAttribute('aria-label', link.textContent.trim() || 'Video');
        if (body.dataset.cover) video.poster = body.dataset.cover;
        video.appendChild(link.cloneNode(true));
        paragraph.replaceWith(video);
    });
});
