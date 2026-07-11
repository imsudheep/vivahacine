document.addEventListener('DOMContentLoaded', function () {
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');

    if (!id) {
        document.getElementById('main-content').innerHTML = '<div class="container" style="padding:8rem 2rem 4rem;text-align:center;"><p style="font-size:1.2rem;color:var(--text-muted)">No project specified. <a href="portfolio.html" style="color:var(--text-color)">Browse our portfolio.</a></p></div>';
        return;
    }

    var project = null;
    for (var i = 0; i < projects.length; i++) {
        if (projects[i].id === id) {
            project = projects[i];
            break;
        }
    }

    if (!project) {
        document.getElementById('main-content').innerHTML = '<div class="container" style="padding:8rem 2rem 4rem;text-align:center;"><p style="font-size:1.2rem;color:var(--text-muted)">Project not found. <a href="portfolio.html" style="color:var(--text-color)">Browse our portfolio.</a></p></div>';
        return;
    }

    document.title = project.title + ' — Vivaha Cine';

    document.getElementById('project-hero-img').src = project.cover;
    document.getElementById('project-hero-img').alt = project.title;
    document.getElementById('project-hero-category').textContent = project.category.toUpperCase();
    document.getElementById('project-hero-title').innerHTML = project.title.replace(/ & /g, ' <span class="italic">&</span> ');
    document.getElementById('project-hero-meta').innerHTML = '<span>' + project.location + '</span><span class="project-hero-divider"></span><span>' + project.date + '</span>';

    document.getElementById('project-description').textContent = project.description;

    var testimonialEl = document.getElementById('project-testimonial');
    testimonialEl.querySelector('.project-quote').textContent = '\u201C' + project.testimonial + '\u201D';
    testimonialEl.querySelector('.project-quote-author').textContent = project.testimonialAuthor;

    document.getElementById('project-client').textContent = project.client;
    document.getElementById('project-location').textContent = project.location;
    document.getElementById('project-date').textContent = project.date;
    document.getElementById('project-category').textContent = project.category;

    var galleryHtml = '';
    for (var g = 0; g < project.gallery.length; g++) {
        galleryHtml += '<div class="project-gallery-item">';
        galleryHtml +=   '<img src="' + project.gallery[g] + '" alt="' + project.title + ' photo ' + (g + 1) + '" class="project-gallery-img" loading="lazy">';
        galleryHtml += '</div>';
    }
    document.getElementById('project-gallery').innerHTML = galleryHtml;

    var currentIndex = -1;
    for (var j = 0; j < projects.length; j++) {
        if (projects[j].id === id) {
            currentIndex = j;
            break;
        }
    }

    var navLinks = document.querySelector('.project-nav-links');
    if (navLinks && currentIndex !== -1) {
        var prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
        var nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

        var navHtml = '';
        if (prevProject) {
            navHtml += '<a href="project.html?id=' + encodeURIComponent(prevProject.id) + '" class="project-nav-link project-nav-prev">';
            navHtml +=   '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>';
            navHtml +=   '<span class="project-nav-direction">Previous</span>';
            navHtml +=   '<span class="project-nav-name">' + prevProject.title + '</span>';
            navHtml += '</a>';
        } else {
            navHtml += '<div class="project-nav-link project-nav-prev project-nav-empty"></div>';
        }

        if (nextProject) {
            navHtml += '<a href="project.html?id=' + encodeURIComponent(nextProject.id) + '" class="project-nav-link project-nav-next">';
            navHtml +=   '<span class="project-nav-direction">Next</span>';
            navHtml +=   '<span class="project-nav-name">' + nextProject.title + '</span>';
            navHtml +=   '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
            navHtml += '</a>';
        } else {
            navHtml += '<div class="project-nav-link project-nav-next project-nav-empty"></div>';
        }

        navLinks.innerHTML = navHtml;
    }
});
