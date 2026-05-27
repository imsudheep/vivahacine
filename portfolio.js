document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('portfolio-grid');
    var filterBtns = document.querySelectorAll('.portfolio-filter-btn');
    var currentFilter = 'all';

    if (!grid) return;

    function renderProjects(filter) {
        var filtered = filter === 'all' ? projects : projects.filter(function (p) { return p.category === filter; });
        var html = '';
        filtered.forEach(function (p) {
            html += '<a href="project.html?id=' + encodeURIComponent(p.id) + '" class="project-card">';
            html +=   '<div class="project-card-img-wrap">';
            html +=     '<img src="' + p.cover + '" alt="' + p.title + '" class="project-card-img" loading="lazy">';
            html +=     '<div class="project-card-overlay">';
            html +=       '<span class="project-card-view">View Project</span>';
            html +=     '</div>';
            html +=   '</div>';
            html +=   '<div class="project-card-body">';
            html +=     '<span class="project-card-category">' + p.category + '</span>';
            html +=     '<h3 class="project-card-title">' + p.title + '</h3>';
            html +=     '<p class="project-card-desc">' + p.description.substring(0, 100) + '...</p>';
            html +=     '<div class="project-card-meta">';
            html +=       '<span class="project-card-location">' + p.location + '</span>';
            html +=       '<span class="project-card-date">' + p.date + '</span>';
            html +=     '</div>';
            html +=   '</div>';
            html += '</a>';
        });
        grid.innerHTML = html || '<p class="portfolio-empty">No projects found for this category.</p>';
    }

    renderProjects('all');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            renderProjects(currentFilter);
        });
    });
});
