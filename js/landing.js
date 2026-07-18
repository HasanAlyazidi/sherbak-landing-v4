$(document).ready(function () {
    var $loading = $('#page_loading');
    var loadingShownAt = Date.now();
    var LOADING_MIN_MS = 800;

    function hideLoading() {
        var wait = Math.max(0, LOADING_MIN_MS - (Date.now() - loadingShownAt));

        setTimeout(function () {
            $loading.addClass('hide').attr('aria-hidden', 'true');
        }, wait);
    }

    $(window).on('load', hideLoading);
    setTimeout(hideLoading, 4000);

    var html = document.documentElement;
    var LANG_KEY = 'sherbak-landing-lang';

    function applyLang(lang) {
        html.setAttribute('lang', lang);
        html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        document.title = lang === 'ar'
            ? 'شيرباك — كل رحلة فرصة | توصيل الشحنات مع المسافرين'
            : 'SherBak — Every trip is an opportunity | Peer-to-peer parcel delivery';
    }

    var savedLang = null;

    try { savedLang = localStorage.getItem(LANG_KEY); } catch (e) {}

    applyLang(savedLang === 'en' ? 'en' : 'ar');

    $('[data-lang-toggle]').on('click', function () {
        var next = html.getAttribute('lang') === 'ar' ? 'en' : 'ar';

        applyLang(next);
        initGallerySlider();

        var rotator = document.getElementById('hero_rotator');

        if (rotator) {
            rotator.innerHTML = next === 'en'
                ? '<span class="accent-2">Sher</span><span class="accent">Bak</span>'
                : '<span class="accent-2">شير</span><span class="accent">باك</span>';
        }

        try { localStorage.setItem(LANG_KEY, next); } catch (e) {}
    });

    var navbar = document.querySelector('.navbar-sherbak');
    var progress = document.querySelector('.scroll-progress');
    var backTop = document.querySelector('.back-top');

    function onScroll() {
        var y = window.scrollY;

        navbar.classList.toggle('scrolled', y > 24);

        if (progress) {
            var max = document.documentElement.scrollHeight - window.innerHeight;
            progress.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
        }

        if (backTop) {
            backTop.classList.toggle('show', y > 600);
        }
    }

    $(window).on('scroll resize', onScroll);
    onScroll();

    $('.back-top').on('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    var boardRows = document.querySelectorAll('.board-row');

    if (boardRows.length) {
        setInterval(function () {
            boardRows.forEach(function (row) {
                row.classList.add('flip');
            });

            setTimeout(function () {
                boardRows.forEach(function (row) {
                    var ends = row.querySelectorAll('.route-end');
                    var tmp = ends[0].innerHTML;

                    ends[0].innerHTML = ends[1].innerHTML;
                    ends[1].innerHTML = tmp;
                    row.classList.toggle('reversed');
                    row.classList.remove('flip');
                });
            }, 360);
        }, 5000);
    }

    var ytIntroId = 'ANriJF3fuu4';

    $('#ytPlayer').on('show.bs.modal', function () {
        $('#ytPlayerFrame').attr('src', 'https://www.youtube.com/embed/' + ytIntroId + '?autoplay=1&rel=0');
    });

    $('#ytPlayer').on('hidden.bs.modal', function () {
        $('#ytPlayerFrame').attr('src', '');
    });

    var $navMenu = $('#navMenu');

    if ($navMenu.length) {
        $navMenu.on('show.bs.collapse', function () {
            $('.nav-burger i').attr('class', 'fa-solid fa-xmark');
        });

        $navMenu.on('hide.bs.collapse', function () {
            $('.nav-burger i').attr('class', 'fa-solid fa-bars');
        });

        $navMenu.find('a').on('click', function () {
            if ($navMenu.hasClass('show')) $navMenu.collapse('hide');
        });
    }

    var revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(function (el) { revealObserver.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('in'); });
    }

    var spyLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    var spyMap = {};

    spyLinks.forEach(function (link) {
        spyMap[link.getAttribute('href').slice(1)] = link;
    });

    if ('IntersectionObserver' in window) {
        var spyObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) { return; }

                spyLinks.forEach(function (link) { link.classList.remove('active'); });

                if (spyMap[entry.target.id]) {
                    spyMap[entry.target.id].classList.add('active');
                }
            });
        }, { rootMargin: '-35% 0px -55% 0px' });

        Object.keys(spyMap).forEach(function (id) {
            var el = document.getElementById(id);

            if (el) { spyObserver.observe(el); }
        });
    }

    $('.faq-q').on('click', function () {
        var $item = $(this).closest('.faq-item');
        var isOpen = $item.hasClass('open');

        $('.faq-item.open').each(function () {
            $(this).removeClass('open');
            $(this).find('.faq-a').css('max-height', '0px');
            $(this).find('.faq-q').attr('aria-expanded', 'false');
        });

        if (!isOpen) {
            var $a = $item.find('.faq-a');

            $item.addClass('open');
            $a.css('max-height', $a.prop('scrollHeight') + 'px');
            $(this).attr('aria-expanded', 'true');
        }
    });

    $('[data-gallery-dir]').on('click', function () {
        var dir = $(this).data('gallery-dir');

        $('#gallery_slider').slick(dir === 1 ? 'slickNext' : 'slickPrev');
    });

    var heroSection = document.querySelector('.hero');
    var heroPhone = document.querySelector('.hero-phone');
    var motionOK = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

    if (heroSection && heroPhone && motionOK && window.matchMedia('(pointer: fine)').matches) {
        heroPhone.style.transition = 'transform 0.25s ease-out';

        heroSection.addEventListener('mousemove', function (e) {
            var r = heroSection.getBoundingClientRect();
            var x = (e.clientX - r.left) / r.width - 0.5;
            var y = (e.clientY - r.top) / r.height - 0.5;

            heroPhone.style.transform = 'translate3d(' + (x * 16).toFixed(1) + 'px,' + (y * 12).toFixed(1) + 'px,0)';
        });

        heroSection.addEventListener('mouseleave', function () {
            heroPhone.style.transform = '';
        });
    }

    var $soonModal = $('#soon_modal');

    $(document).on('click', '[data-store-soon]', function (e) {
        e.preventDefault();
        $soonModal.addClass('show').attr('aria-hidden', 'false');
    });

    $(document).on('click', '[data-soon-close]', function () {
        $soonModal.removeClass('show').attr('aria-hidden', 'true');
    });

    $(document).on('keydown', function (e) {
        if (e.key === 'Escape') {
            $soonModal.removeClass('show').attr('aria-hidden', 'true');
        }
    });

    initGallerySlider();
    initStatCounters();
    initHeroRotator();
});

function initHeroRotator() {
    var el = document.getElementById('hero_rotator');

    if (!el) return;

    var phrases = {
        ar: [
            '<span class="accent-2">شير</span><span class="accent">باك</span>',
            'حقيبتك <span class="accent">فرصة دخل</span>',
            'طلبك <span class="accent">يصل أسرع</span>'
        ],
        en: [
            '<span class="accent-2">Sher</span><span class="accent">Bak</span>',
            'Your luggage is <span class="accent">income</span>',
            'Your parcel <span class="accent">arrives faster</span>'
        ]
    };

    var index = 0;

    function currentList() {
        return phrases[document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'ar'];
    }

    el.innerHTML = currentList()[0];

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) return;

    setInterval(function () {
        el.classList.add('rot-out');

        setTimeout(function () {
            index = (index + 1) % currentList().length;
            el.innerHTML = currentList()[index];
            el.classList.remove('rot-out');
            el.classList.add('rot-prep');

            void el.offsetWidth;

            el.classList.remove('rot-prep');
        }, 460);
    }, 3600);
}

function initGallerySlider() {
    var $slider = $('#gallery_slider');

    if ($slider.length === 0) return;

    var isRtl = document.documentElement.getAttribute('dir') === 'rtl';

    if ($slider.hasClass('slick-initialized')) {
        $slider.slick('unslick');
    }

    $slider.slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        rtl: isRtl,
        infinite: false,
        arrows: false,
        dots: false,
        responsive: [
            { breakpoint: 992, settings: { slidesToShow: 3 } },
            { breakpoint: 576, settings: { slidesToShow: 1 } }
        ]
    });
}

function initStatCounters() {
    var nodes = document.querySelectorAll('.stat-number[data-count]');

    if (!nodes.length || !('IntersectionObserver' in window)) {
        return;
    }

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
        return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                countUp(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.45 });

    nodes.forEach(function (node) { observer.observe(node); });
}

function countUp(el) {
    var raw   = el.getAttribute('data-count') || el.textContent;
    var match = raw.match(/[\d.,]+/);

    if (!match) {
        return;
    }

    var numStr   = match[0];
    var prefix   = raw.slice(0, match.index);
    var suffix   = raw.slice(match.index + numStr.length);
    var hasComma = numStr.indexOf(',') !== -1;
    var decimals = (numStr.split('.')[1] || '').length;
    var target   = parseFloat(numStr.replace(/,/g, ''));

    if (isNaN(target)) {
        return;
    }

    var duration = 1600;
    var startTs  = null;

    function format(value) {
        var out = decimals ? value.toFixed(decimals) : Math.round(value).toString();

        if (hasComma) {
            out = out.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }

        return prefix + out + suffix;
    }

    function tick(ts) {
        if (!startTs) {
            startTs = ts;
        }

        var progress = Math.min((ts - startTs) / duration, 1);
        var eased    = 1 - Math.pow(1 - progress, 3);

        el.textContent = format(target * eased);

        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            el.textContent = raw;
        }
    }

    el.textContent = format(0);
    requestAnimationFrame(tick);
}
