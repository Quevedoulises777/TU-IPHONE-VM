/* =========================================================
   TU IPHONE VM - MAIN LOGIC
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. HERO CAROUSEL LOGIC --- */
    const heroSection = document.getElementById('hero');
    const heroBg = document.getElementById('heroBg');
    const slides = document.querySelectorAll('.h-slide');
    const switchBtns = document.querySelectorAll('.switch-btn');
    const switcherBg = document.getElementById('switcherBg');

    const bgGradientsDark = [
        'radial-gradient(circle at 10% 50%, rgba(249, 115, 22, 0.25), transparent 50%)',
        'radial-gradient(circle at 90% 50%, rgba(59, 130, 246, 0.25), transparent 50%)',
        'radial-gradient(circle at 10% 50%, rgba(16, 185, 129, 0.25), transparent 50%)'
    ];

    let currentHeroSlide = 0;
    let heroInterval = null;

    function updateSwitcherBg(index) {
        if(window.innerWidth > 900) {
            const btn = switchBtns[index];
            switcherBg.style.width = btn.offsetWidth + 'px';
            switcherBg.style.left = btn.offsetLeft + 'px';
            switcherBg.style.opacity = 1;
        } else {
            switcherBg.style.opacity = 0;
        }
    }

    function goToSlide(index) {
        slides[currentHeroSlide].classList.remove('active');
        switchBtns[currentHeroSlide].classList.remove('active');
        
        currentHeroSlide = index;

        slides[currentHeroSlide].classList.add('active');
        switchBtns[currentHeroSlide].classList.add('active');
        heroSection.setAttribute('data-active', index);
        heroBg.style.background = bgGradientsDark[index];
        updateSwitcherBg(index);
    }

    // Init Hero
    setTimeout(() => goToSlide(0), 150);

    switchBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            clearInterval(heroInterval); 
            goToSlide(parseInt(e.target.getAttribute('data-index')));
            startHeroAuto();
        });
    });

    window.addEventListener('resize', () => {
        if(document.getElementById('hero')) updateSwitcherBg(currentHeroSlide)
    });

    function startHeroAuto() {
        heroInterval = setInterval(() => {
            goToSlide((currentHeroSlide + 1) % slides.length);
        }, 7000); 
    }
    startHeroAuto();

    /* --- 2. GLOBAL CONSTANTS & CART --- */
    const WHATSAPP_NUMBER = "5492664507096";
    let cart = [];

    // DOM Elements for Cart
    const cartBtn = document.getElementById('cartBtn');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotalValue = document.getElementById('cartTotalValue');
    const checkoutBtn = document.getElementById('checkoutBtn');

    cartBtn.addEventListener('click', () => cartOverlay.classList.add('active'));
    closeCartBtn.addEventListener('click', () => cartOverlay.classList.remove('active'));

    function updateCartUI() {
        cartCount.innerText = cart.length;
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Tu bolsa está vacía.</div>';
            cartTotalValue.innerText = '$0';
            return;
        }

        let totalUsd = 0; let totalArs = 0;
        cart.forEach((item, index) => {
            if(item.isArs) totalArs += item.price; else totalUsd += item.price;
            let symbol = item.isArs ? "ARS $" : "USD ";
            const div = document.createElement('div');
            div.className = 'cart-item glass-panel';
            div.innerHTML = `
                <img src="${item.img}" alt="${item.title}">
                <div class="c-item-details">
                    <div class="c-item-title">${item.title}</div>
                    <div class="c-item-desc">${item.desc}</div>
                    <div class="c-item-price">${symbol}${item.price}</div>
                </div>
                <button class="btn-icon" onclick="removeFromCart(${index})" style="width:30px;height:30px;font-size:14px;"><i class="ph ph-trash"></i></button>
            `;
            cartItemsContainer.appendChild(div);
        });

        cartTotalValue.innerText = `Total: USD ${totalUsd} | ARS $${totalArs}`;
    }

    window.removeFromCart = (index) => {
        cart.splice(index, 1);
        updateCartUI();
    };

    checkoutBtn.addEventListener('click', () => {
        if(cart.length === 0) return;
        let isAllUsd = cart.every(i => !i.isArs);
        let msg = "¡Hola TU IPHONE VM! Quisiera finalizar mi compra:\n\n";
        let totalUSD = 0;
        let totalARS = 0;
        cart.forEach(item => {
            let symbol = item.isArs ? "ARS $" : "USD ";
            msg += `- ${item.title} (${item.desc}) -> ${symbol}${item.price}\n`;
            if(item.isArs) totalARS += item.price;
            else totalUSD += item.price;
        });
        msg += `\n*RESUMEN TOTAL:*`;
        if(totalUSD > 0) msg += `\n- Equipos: USD ${totalUSD}`;
        if(totalARS > 0) msg += `\n- Accesorios: ARS $${totalARS}`;
        msg += "\n\n¿Me confirman disponibilidad y métodos de pago?";
        
        window.open(`https://api.whatsapp.com/send/?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(msg)}&type=phone_number&app_absent=0`, "_blank");
    });


    /* --- 3. PRODUCTS DATA & RENDER --- */
    const productsData = [
        { id: 10, serie: "17", title: "iPhone 17 Sellado", desc: "256GB Verde, Sellado", state: "sellado", price: 950, img: "https://tligscofqdyubgmumyla.supabase.co/storage/v1/object/sign/iphone/apple-iphone-17.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZjQwOWM4Zi0wYmI1LTQyODMtYjZlZS1iNDQ2MTY3YjQxMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpcGhvbmUvYXBwbGUtaXBob25lLTE3LnBuZyIsImlhdCI6MTc3NjIwOTY1NCwiZXhwIjoxODA3NzQ1NjU0fQ.2iKYd4fPKAViaZpqPeHIeYzD7_Ep55SnSenOntGR_yY", badge: "NUEVO", bClass: "s-novedad" },
        { id: 1, serie: "17", title: "iPhone 17 AIR", desc: "256GB Azul, Nuevo Sellado", state: "sellado", price: 1375, img: "https://tligscofqdyubgmumyla.supabase.co/storage/v1/object/sign/iphone/apple-iphone-air-256gb-azul-ciel.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZjQwOWM4Zi0wYmI1LTQyODMtYjZlZS1iNDQ2MTY3YjQxMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpcGhvbmUvYXBwbGUtaXBob25lLWFpci0yNTZnYi1henVsLWNpZWwucG5nIiwiaWF0IjoxNzc2MjA5NjkzLCJleHAiOjE4MDc3NDU2OTN9.i0ieil-63gk4nBWI1MufLMBVAWjtEW9gJ2QGjNiv6jM", badge: "NOVEDAD EXCLUSIVA", bClass: "s-novedad" },
        { id: 2, serie: "16", title: "iPhone 16 Pro Max", desc: "256GB Negro, Batería 90%", state: "certificado", price: 975, img: "https://tligscofqdyubgmumyla.supabase.co/storage/v1/object/sign/iphone/ip%2016%20pro%20max.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZjQwOWM4Zi0wYmI1LTQyODMtYjZlZS1iNDQ2MTY3YjQxMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpcGhvbmUvaXAgMTYgcHJvIG1heC5wbmciLCJpYXQiOjE3NzYyMDk3MzMsImV4cCI6MTc3NjgxNDUzM30.PVIDJZ-UKGlu0e-V7ly0DIluFRQ_Tr63EGV4gfNrujo", badge: "TOP VENTAS", bClass: "s-promo" },
        { id: 3, serie: "16", title: "iPhone 16 128GB", desc: "128GB Rosa, Batería 100%", state: "certificado", price: 725, img: "https://tligscofqdyubgmumyla.supabase.co/storage/v1/object/sign/iphone/iPhone%2016%20128GB%20-%20Pink.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZjQwOWM4Zi0wYmI1LTQyODMtYjZlZS1iNDQ2MTY3YjQxMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpcGhvbmUvaVBob25lIDE2IDEyOEdCIC0gUGluay5wbmciLCJpYXQiOjE3NzUyNjAxOTQsImV4cCI6MTgwNjc5NjE5NH0.ajs9aYhik6-dqy12h1jGSZZCSafTwF6b5sIylLHHIoU", badge: "IMPECABLE", bClass: "s-novedad" },
        { id: 4, serie: "15", title: "iPhone 15 Pro", desc: "128GB Negro, Batería 89%", state: "certificado", price: 630, img: "https://tligscofqdyubgmumyla.supabase.co/storage/v1/object/sign/iphone/ip%2015.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZjQwOWM4Zi0wYmI1LTQyODMtYjZlZS1iNDQ2MTY3YjQxMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpcGhvbmUvaXAgMTUucG5nIiwiaWF0IjoxNzc1MjYwMTY3LCJleHAiOjE4MDY3OTYxNjd9.MJF8GfEYnfCR4bfTfRwvrJ5tUnpN3XcXzgA2Y5X7xTw", badge: "OFERTA", bClass: "s-promo" },
        { id: 5, serie: "14", title: "iPhone 14 Pro", desc: "256GB Violeta, Batería 100%", state: "certificado", price: 580, img: "https://tligscofqdyubgmumyla.supabase.co/storage/v1/object/sign/iphone/14%20pro.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZjQwOWM4Zi0wYmI1LTQyODMtYjZlZS1iNDQ2MTY3YjQxMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpcGhvbmUvMTQgcHJvLnBuZyIsImlhdCI6MTc3NTI2MDAzMiwiZXhwIjoxODA2Nzk2MDMyfQ.W1OahQfXH88gwlzeMbnHJNw9zDf5kvVZXmYQ11Cz41c", badge: "", bClass: "" },
        { id: 6, serie: "13", title: "iPhone 13", desc: "128GB Negro, Batería 100%", state: "certificado", price: 375, img: "https://tligscofqdyubgmumyla.supabase.co/storage/v1/object/sign/iphone/IP%2013.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZjQwOWM4Zi0wYmI1LTQyODMtYjZlZS1iNDQ2MTY3YjQxMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpcGhvbmUvSVAgMTMucG5nIiwiaWF0IjoxNzc1MjYwMTE1LCJleHAiOjE4MDY3OTYxMTV9.67F7xtPPyTmsp8A7y40KFfFmxfTwr4ro_Ig9DnKjIr4", badge: "CALIDAD PRECIO", bClass: "s-ultima" },
        { id: 7, serie: "12", title: "iPhone 12 Pro Max", desc: "256GB Azul, Batería 81%", state: "certificado", price: 420, img: "https://tligscofqdyubgmumyla.supabase.co/storage/v1/object/sign/iphone/iphone-12-pro-gold-hero-e1686092911121.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZjQwOWM4Zi0wYmI1LTQyODMtYjZlZS1iNDQ2MTY3YjQxMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpcGhvbmUvaXBob25lLTEyLXByby1nb2xkLWhlcm8tZTE2ODYwOTI5MTExMjEud2VicCIsImlhdCI6MTc3NTI2MDEzNSwiZXhwIjoxODA2Nzk2MTM1fQ.xFHN4L6dEQbDBEaRcQfC7nKflT-_ESWZdUbXeMJqLIY", badge: "REBAJADO", bClass: "s-ultima" },
        { id: 8, serie: "11", title: "iPhone 11", desc: "64GB Rojo, Batería 100%", state: "certificado", price: 220, img: "https://tligscofqdyubgmumyla.supabase.co/storage/v1/object/sign/iphone/iphone11-red-select-2019_GEO_EMEA-1.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZjQwOWM4Zi0wYmI1LTQyODMtYjZlZS1iNDQ2MTY3YjQxMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpcGhvbmUvaXBob25lMTEtcmVkLXNlbGVjdC0yMDE5X0dFT19FTUVBLTEucG5nIiwiaWF0IjoxNzc1MjU5OTg1LCJleHAiOjE4MDY3OTU5ODV9.vCUz_CmbqbQ3W6N3RWt2_QFUh5cdsic8Oz56t9RCsbg", badge: "OPORTUNIDAD", bClass: "s-promo" }
    ];

    const accData = [
        { id: "A1", title: "AirPods 4 Certificados", price: 40000, img: "https://tligscofqdyubgmumyla.supabase.co/storage/v1/object/sign/iphone/AirPods%204.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZjQwOWM4Zi0wYmI1LTQyODMtYjZlZS1iNDQ2MTY3YjQxMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpcGhvbmUvQWlyUG9kcyA0LnBuZyIsImlhdCI6MTc3NTQ5OTg2MCwiZXhwIjoxODA3MDM1ODYwfQ.6x8PyW4MTEYJLQfUhwiHQSN1f1k4IyawM_1IvoRf0fA" },
        { id: "A2", title: "AirPods Max Certificados", price: 37000, img: "https://tligscofqdyubgmumyla.supabase.co/storage/v1/object/sign/iphone/AirPods%204.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZjQwOWM4Zi0wYmI1LTQyODMtYjZlZS1iNDQ2MTY3YjQxMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpcGhvbmUvQWlyUG9kcyA0LnBuZyIsImlhdCI6MTc3NjIwOTc2OCwiZXhwIjoxNzc2ODE0NTY4fQ.301bdYwY7ar8xIaw5Bfu5kXu1e0dtNyVJwrQkeBOUvY" },
        { id: "A3", title: "AirPods Pro 3 Certificados", price: 50000, img: "https://tligscofqdyubgmumyla.supabase.co/storage/v1/object/sign/iphone/AirPods%204.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZjQwOWM4Zi0wYmI1LTQyODMtYjZlZS1iNDQ2MTY3YjQxMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpcGhvbmUvQWlyUG9kcyA0LnBuZyIsImlhdCI6MTc3NjIwOTc2OCwiZXhwIjoxNzc2ODE0NTY4fQ.301bdYwY7ar8xIaw5Bfu5kXu1e0dtNyVJwrQkeBOUvY" },
        { id: "A4", title: "Fundas MagSafe", price: 8500, img: "https://tligscofqdyubgmumyla.supabase.co/storage/v1/object/sign/iphone/silicona-original-iphone-17-pro-max-1.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZjQwOWM4Zi0wYmI1LTQyODMtYjZlZS1iNDQ2MTY3YjQxMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpcGhvbmUvc2lsaWNvbmEtb3JpZ2luYWwtaXBob25lLTE3LXByby1tYXgtMS5wbmciLCJpYXQiOjE3NzYyMDk4NjgsImV4cCI6MTgwNzc0NTg2OH0.ZhkVSq0N3acz38IxLxJdZqL5PSsN78N_UCV3joqKJMY" },
        { id: "A5", title: "Fuente 20w", price: 12500, img: "https://tligscofqdyubgmumyla.supabase.co/storage/v1/object/sign/iphone/20W%20USB-C%20POWER%20ADAPTER-LAL.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZjQwOWM4Zi0wYmI1LTQyODMtYjZlZS1iNDQ2MTY3YjQxMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpcGhvbmUvMjBXIFVTQi1DIFBPV0VSIEFEQVBURVItTEFMLnBuZyIsImlhdCI6MTc3NTQ5OTg0MCwiZXhwIjoxODA3MDM1ODQwfQ.qC3ns37V7LqJdYybfogDJQFOETiF-hNG40dKUMqgIIg" },
        { id: "A6", title: "Cable Tipo C / Lightning", price: 4300, img: "https://tligscofqdyubgmumyla.supabase.co/storage/v1/object/sign/iphone/usb%20ip%205m.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZjQwOWM4Zi0wYmI1LTQyODMtYjZlZS1iNDQ2MTY3YjQxMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpcGhvbmUvdXNiIGlwIDVtLnBuZyIsImlhdCI6MTc3NjIwOTc4OSwiZXhwIjoxODA3NzQ1Nzg5fQ.2oBXK-_l3eVA_5JVNhsX2Eu9Wla7Xq_0XL0yXiFsWEM" },
        { id: "A7", title: "Protector de Cámara", price: 5000, img: "https://tligscofqdyubgmumyla.supabase.co/storage/v1/object/sign/iphone/Protectorcamarabrillosplateados.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZjQwOWM4Zi0wYmI1LTQyODMtYjZlZS1iNDQ2MTY3YjQxMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpcGhvbmUvUHJvdGVjdG9yY2FtYXJhYnJpbGxvc3BsYXRlYWRvcy53ZWJwIiwiaWF0IjoxNzc1NDk5OTA3LCJleHAiOjE4MDcwMzU5MDd9.dvEMzCUHasiAbcXsJgKo--m1skgUXpyM3bVHtjR5EBY" }
    ];

    const prodGrid = document.getElementById('productGrid');
    
    function renderProducts(filterSerie = "all", filterState = "all", searchQuery = "") {
        prodGrid.innerHTML = '';
        
        let filtered = productsData.filter(p => {
            const matchSerie = filterSerie === "all" || p.serie === filterSerie;
            const matchState = filterState === "all" || p.state === filterState;
            const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
            return matchSerie && matchState && matchSearch;
        });

        if (filtered.length === 0) {
            prodGrid.innerHTML = '<p style="padding:20px; color:#8b8b93;">No se encontraron resultados.</p>';
            return;
        }

        filtered.forEach(p => {
            const sticker = p.badge ? `<span class="p-sticker ${p.bClass}">${p.badge}</span>` : '';
            const card = document.createElement('div');
            card.className = 'p-card glass-panel';
            card.innerHTML = `
                ${sticker}
                <div class="p-img-wrap"><img src="${p.img}" alt="${p.title}"></div>
                <div class="p-info">
                    <h3 class="p-title">${p.title}</h3>
                    <p class="p-versions">${p.desc}</p>
                    <div class="p-price text-glow">USD ${p.price}</div>
                    <div style="display: flex; gap: 8px; margin-top: 12px; width: 100%;">
                         <button class="btn-secondary conf-btn" style="flex:1; padding: 10px 5px; font-size: 11px; text-transform:uppercase; justify-content:center;" data-id="${p.id}"><i class="ph ph-sliders"></i> Config.</button>
                         <button class="add-btn add-to-cart" style="flex:1; padding: 10px 5px; font-size: 11px; text-transform:uppercase;" data-id="${p.id}">🛒 Añadir</button>
                    </div>
                </div>
            `;
            prodGrid.appendChild(card);
        });

        // Config Modal Logic Handler
        const configModal = document.getElementById('configModal');
        const closeConfigBtn = document.getElementById('closeConfigBtn');
        let currentModalProd = null;
        let modalVars = { ver: 0, cap: 0, color: 0, bat: 0 };
        let modalStrings = { ver: "Base", cap: "128GB", color: "Oscuro", bat: "-" };

        if(closeConfigBtn) closeConfigBtn.addEventListener('click', () => configModal.classList.remove('active'));

        function handleModalPill(groupSelector, varKey, stringKey) {
            const btns = document.querySelectorAll(`${groupSelector} .pill-btn`);
            btns.forEach(b => {
                b.addEventListener('click', () => {
                    btns.forEach(x => x.classList.remove('active'));
                    b.classList.add('active');
                    modalVars[varKey] = parseInt(b.getAttribute('data-mod'));
                    modalStrings[stringKey] = b.getAttribute('data-name');
                    const t = currentModalProd.price + modalVars.ver + modalVars.cap + modalVars.color + modalVars.bat;
                    document.getElementById('modalFinalPrice').innerText = `USD ${t}`;
                });
            });
        }
        
        handleModalPill('#prodVersion', 'ver', 'ver');
        handleModalPill('#prodCap', 'cap', 'cap');
        handleModalPill('#prodColor', 'color', 'color');
        handleModalPill('#prodBat', 'bat', 'bat');

        const modalAddToCartBtn = document.getElementById('modalAddToCart');
        if(modalAddToCartBtn) {
            modalAddToCartBtn.onclick = () => {
                if(!currentModalProd) return;
                const finalPrice = currentModalProd.price + modalVars.ver + modalVars.cap + modalVars.color + modalVars.bat;
                const configDesc = `${modalStrings.ver} | ${modalStrings.cap} | ${modalStrings.color} | Bat: ${modalStrings.bat}`;
                cart.push({ title: currentModalProd.title, desc: configDesc, price: finalPrice, img: currentModalProd.img, isArs: false });
                configModal.classList.remove('active');
                updateCartUI();
                document.getElementById('cartOverlay').classList.add('active');
            };
        }

        document.querySelectorAll('.conf-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'));
                currentModalProd = productsData.find(x => x.id === id);
                document.getElementById('modalProdTitle').innerText = currentModalProd.title;
                document.querySelectorAll('#configModal .pill-btn.active').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('#configModal .config-group').forEach(grp => {
                   const first = grp.querySelector('.pill-btn');
                   if(first) first.classList.add('active');
                });
                modalVars = { ver: 0, cap: 0, color: 0, bat: 0 };
                modalStrings = { ver: "Base", cap: "128GB", color: "Oscuro", bat: "(Nuevo)" };
                document.getElementById('modalFinalPrice').innerText = `USD ${currentModalProd.price}`;
                configModal.classList.add('active');
            });
        });

        // re-attach cart listeners
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'));
                const prod = productsData.find(x => x.id === id);
                cart.push({ title: prod.title, desc: "Configuración Base", price: prod.price, img: prod.img, isArs: false });
                updateCartUI();
                cartOverlay.classList.add('active');
            });
        });
    }

    // Init products
    renderProducts();

    // Filters behavior
    const fModel = document.getElementById('filterModel');
    const fStatus = document.getElementById('filterStatus');
    const fSearch = document.getElementById('searchInput');

    function applyFilters() {
        renderProducts(fModel.value, fStatus.value, fSearch.value);
    }

    fModel.addEventListener('change', applyFilters);
    fStatus.addEventListener('change', applyFilters);
    fSearch.addEventListener('input', applyFilters);

    function buildAccessories() {
        const accGrid = document.getElementById('accessoriesGrid');
        accData.forEach(a => {
            const card = document.createElement('div');
            card.className = 'acc-card glass-panel';
            card.innerHTML = `
                <img src="${a.img}" alt="${a.title}">
                <h3>${a.title}</h3>
                <div class="p-price text-glow">ARS $${a.price}</div>
                <button class="add-btn acc-add" data-id="${a.id}">Sumar</button>
            `;
            accGrid.appendChild(card);
        });

        document.querySelectorAll('.acc-add').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const acc = accData.find(x => x.id === id);
                cart.push({ title: acc.title, desc: "Accesorio", price: acc.price, img: acc.img, isArs: true });
                updateCartUI();
                cartOverlay.classList.add('active');
            });
        });
    }
    buildAccessories();


    /* --- 4. SLIDER CONTROLS (CSS Grid Scroll) --- */
    function attachSliderNav(prevId, nextId, trackId) {
        const track = document.getElementById(trackId);
        const prev = document.getElementById(prevId);
        const next = document.getElementById(nextId);
        
        if(!track || !prev || !next) return;

        // Ancho que se desplaza = ancho de tarjeta + gap = ~340px aprox
        const scrollAmount = 344; 

        prev.addEventListener('click', () => { track.scrollBy({ left: -scrollAmount, behavior: 'smooth' }); });
        next.addEventListener('click', () => { track.scrollBy({ left: scrollAmount, behavior: 'smooth' }); });
    }

    attachSliderNav('prodPrev', 'prodNext', 'productSliderTrack');
    attachSliderNav('accPrev', 'accNext', 'accSliderTrack');


    /* --- 5. COTIZADOR LOGIC --- */
    const seriesSelect = document.getElementById('cfgSeries');
    const versionBtns = document.querySelectorAll('#cfgVersion .pill-btn');
    const capacityBtns = document.querySelectorAll('#cfgCapacity .pill-btn');
    const stateBtns = document.querySelectorAll('#cfgState .pill-btn');
    
    const cotiPriceTag = document.getElementById('cotiFinalPrice');
    const cotiImg = document.getElementById('cotiImg');
    const submitCoti = document.getElementById('cotiSendBtn');

    let currentConfig = {
        serie: "17", serieBasePrice: 1100, serieName: "iPhone 17", img: "",
        versionMod: 0, versionName: "Normal",
        capMod: 0, capName: "128GB",
        stateMod: 0, stateName: "Impecable",
        batteryMod: 0, batteryName: "85% - 100%"
    };

    function handlePillSelection(groupSelector, callback) {
        const btns = document.querySelectorAll(`${groupSelector} .pill-btn`);
        btns.forEach(b => {
            b.addEventListener('click', () => {
                btns.forEach(x => x.classList.remove('active'));
                b.classList.add('active');
                callback(b.getAttribute('data-mod'), b.getAttribute('data-name'));
                calculateCoti();
            });
        });
    }

    seriesSelect.addEventListener('change', (e) => {
        const opt = e.target.options[e.target.selectedIndex];
        currentConfig.serie = e.target.value;
        currentConfig.serieName = opt.text;
        currentConfig.serieBasePrice = parseInt(opt.getAttribute('data-base'));
        currentConfig.img = opt.getAttribute('data-img');
        
        // update image smoothly
        cotiImg.style.opacity = 0;
        setTimeout(() => {
            cotiImg.src = currentConfig.img;
            cotiImg.style.opacity = 1;
        }, 300);

        calculateCoti();
    });

    handlePillSelection('#cfgVersion', (mod, name) => { currentConfig.versionMod = parseInt(mod); currentConfig.versionName = name; });
    handlePillSelection('#cfgCapacity', (mod, name) => { currentConfig.capMod = parseInt(mod); currentConfig.capName = name; });
    handlePillSelection('#cfgState', (mod, name) => { currentConfig.stateMod = parseInt(mod); currentConfig.stateName = name; });
    handlePillSelection('#cfgBattery', (mod, name) => { currentConfig.batteryMod = parseInt(mod); currentConfig.batteryName = name; });

    function calculateCoti() {
        const total = currentConfig.serieBasePrice + currentConfig.versionMod + currentConfig.capMod + currentConfig.stateMod + currentConfig.batteryMod;
        
        // Animating price
        cotiPriceTag.style.transform = "scale(1.1)";
        cotiPriceTag.innerText = `USD ${total}`;
        setTimeout(() => { cotiPriceTag.style.transform = "scale(1)"; }, 200);
        
        return total;
    }

    // Set initial image
    seriesSelect.dispatchEvent(new Event('change'));

    submitCoti.addEventListener('click', () => {
        const finalPrice = calculateCoti();
        let msg = `¡Hola TU IPHONE VM! Tengo este equipo para entregar como parte de pago (Plan Canje) y quisiera saber si lo toman:\n\n`;
        msg += `📱 *Modelo a entregar:* ${currentConfig.serieName} ${currentConfig.versionName}\n`;
        msg += `💾 *Capacidad:* ${currentConfig.capName}\n`;
        msg += `✨ *Estado Físico:* ${currentConfig.stateName}\n`;
        msg += `🔋 *Batería:* ${currentConfig.batteryName}\n\n`;
        msg += `*Valor estimado web:* USD ${finalPrice} a favor\n\n¿Me confirman qué equipos tienen disponibles para hacer el canje?`;
        window.open(`https://api.whatsapp.com/send/?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(msg)}&type=phone_number&app_absent=0`, "_blank");
    });

});
