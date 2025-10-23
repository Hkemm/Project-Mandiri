// app.js untuk TokoKu: merender featured, produk, dan pengelolaan keranjang sederhana
(function(){
  const PRODUCTS = [
  {id:1,title:'VortexMono80',price:300000,category:'Keybord',image:'assets/images/vortexmono80.jpg'},
    {id:2,title:'Inno X2',price:700000,category:'Mouse',image:'assets/images/mouse.jpeg'},
    {id:3,title:'Aula F75',price:450000,category:'Keybord',image:'assets/images/Aulaf75.jpeg'},
    {id:4,title:'Vortex F1/F1Pro',price:500000,category:'Mouse',image:'assets/images/VortexF1.jpeg'},
    {id:5,title:'Rexus Daxa',price:135000,category:'Aksesoris',image:'assets/images/RexusDaxa.jpeg'}
    ,{id:6,title:'Fantech ATO VIBE EDITON Deskmat MP905 Mousepad XL',price:210000,category:'Aksesoris',image:'assets/images/mousepadfantec.webp'},
    {id:7,title:'AXE MECHANICAL - Cherry - GMK Darling - PBT DYE SUB - Keycap - Keycaps',price:120000,category:'Keybord',image:'assets/images/keycaps.webp'},
    {id:8,title:'Logitech G733 LIGHTSPEED Wireless RGB 7.1 Surround Gaming Headset & Mic',price:1650000,category:'Audio',image:'assets/images/HeadsetLogitec.webp'},
    {id:9,title:'Exclusive Launching] Rexus x Attack on Titan - Mousepad Deskmat Anti Slip AOT Series Edition',price:250000,category:'Aksesoris',image:'assets/images/mousepadAOTrexus.webp'},
    {id:10,title:'Rexus FP09 Tetra Boost Foldable Laptop Stand / Dudukan Lipat Laptop',price:175000,category:'Aksesoris',image:'assets/images/StandLaptopKIpasRexus.webp'},
     {id:11,title:'Logitech G733 LIGHTSPEED Wireless RGB 7.1 Surround Gaming Headset & Mic',price:159000,category:'Audio',image:'assets/images/IEMCCA.webp'}
  ];

  function getCart(){ try{return JSON.parse(localStorage.getItem('tk_cart')||'[]')}catch(e){return []} }
  function saveCart(cart){ localStorage.setItem('tk_cart', JSON.stringify(cart)); }
  function updateCartCount(){ const el = document.getElementById('cart-count'); if(!el) return; const cart = getCart(); const count = cart.reduce((s,i)=>s+i.qty,0); el.textContent = count; }
  function addToCart(id){ const cart = getCart(); const found = cart.find(i=>i.id===id); if(found) found.qty +=1; else cart.push({id:id,qty:1}); saveCart(cart); updateCartCount(); }
  function formatRupiah(v){ return 'Rp ' + v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }

  function renderFeaturedGrid(){ const root = document.getElementById('featured-list'); if(!root) return; root.innerHTML='';
    PRODUCTS.slice(0,4).forEach(p=>{
      const card = document.createElement('div'); card.className='card';
      card.innerHTML = `<img src="${p.image}" alt="${p.title}"><h3>${p.title}</h3><p class="price">${formatRupiah(p.price)}</p><div class="actions"><button class="btn btn-primary btn-add" data-id="${p.id}">Tambah</button><a href="products.html" class="btn btn-outline">Lihat Semua</a></div>`;
      root.appendChild(card);
    });
    root.querySelectorAll('.btn-add').forEach(b=>b.addEventListener('click',e=>{ addToCart(parseInt(b.dataset.id)); alert('Ditambahkan ke keranjang'); }));
  }

  function renderCarousel(){ const root = document.getElementById('featured-carousel'); if(!root) return; root.innerHTML = '';
    const id = 'tkCarousel';
    const inner = document.createElement('div'); inner.className='carousel slide'; inner.id = id; inner.setAttribute('data-bs-ride','carousel');
    const indicators = document.createElement('div'); indicators.className='carousel-indicators';
    const innerWrap = document.createElement('div'); innerWrap.className='carousel-inner';
    PRODUCTS.slice(0,3).forEach((p,i)=>{
      const btn = document.createElement('button'); btn.type='button'; btn.setAttribute('data-bs-target','#'+id); btn.setAttribute('data-bs-slide-to',i); if(i===0) btn.className='active'; indicators.appendChild(btn);
      const item = document.createElement('div'); item.className='carousel-item'+(i===0?' active':'');
      item.innerHTML = `<img src="${p.image}" class="d-block w-100" alt="${p.title}"><div class="carousel-caption d-none d-md-block"><h5>${p.title}</h5><p>${formatRupiah(p.price)}</p></div>`;
      innerWrap.appendChild(item);
    });
    const prev = `<button class="carousel-control-prev" type="button" data-bs-target="#${id}" data-bs-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span></button>`;
    const next = `<button class="carousel-control-next" type="button" data-bs-target="#${id}" data-bs-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span></button>`;
    inner.appendChild(indicators); inner.appendChild(innerWrap); inner.innerHTML += prev+next; root.appendChild(inner);
  }

  // --- Helper kategori & rendering produk ---
  function getCategories(){ try{ const s = new Set(PRODUCTS.map(p=>p.category)); return Array.from(s); }catch(e){return []} }

  function populateCategorySelect(){ const sel = document.getElementById('category'); if(!sel) return; sel.innerHTML = '<option value="all">Semua Kategori</option>'; getCategories().forEach(c=>{ const opt = document.createElement('option'); opt.value = c; opt.textContent = c; sel.appendChild(opt); }); }

  function renderProducts(opts){ const root = document.getElementById('products-list'); if(!root) return; opts = opts || {}; const q = (opts.q||'').trim().toLowerCase(); const cat = opts.category||'all'; root.innerHTML = '';
    const list = PRODUCTS.filter(p=>{
      const matchCat = (cat === 'all') || (p.category === cat);
      const matchQ = q === '' || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
    list.forEach(p=>{ const d = document.createElement('div'); d.className = 'card'; d.innerHTML = `<img src="${p.image}" alt="${p.title}"><h3>${p.title}</h3><p class="price">${formatRupiah(p.price)}</p><div class="actions"><button class="btn btn-primary btn-add" data-id="${p.id}">Tambah</button></div>`; root.appendChild(d); });
  // pasang handler tambah-ke-keranjang
    root.querySelectorAll('.btn-add').forEach(b=>b.addEventListener('click',e=>{ addToCart(parseInt(b.dataset.id)); alert('Ditambahkan ke keranjang'); }));
  }

  document.addEventListener('DOMContentLoaded', function(){ updateCartCount(); renderCarousel(); renderFeaturedGrid();
  // render halaman produk jika ada
    const productsRoot = document.getElementById('products-list'); if(productsRoot){
      populateCategorySelect();
      // initial render
      renderProducts({q:'',category:'all'});
  // listener pencarian dan kategori
      const searchInput = document.getElementById('search'); const categorySelect = document.getElementById('category');
      if(searchInput){ searchInput.addEventListener('input', function(e){ renderProducts({q:searchInput.value, category: categorySelect ? categorySelect.value : 'all'}); }); }
      if(categorySelect){ categorySelect.addEventListener('change', function(e){ renderProducts({q: searchInput ? searchInput.value : '', category: categorySelect.value}); }); }
    }
  // atur form kontak
  const form = document.getElementById('contact-form'); if(form){ form.addEventListener('submit', function(e){ e.preventDefault(); const fb = document.getElementById('contact-feedback'); fb.style.color='green'; fb.textContent='Terima kasih! Pesan telah terkirim'; form.reset(); }); }
  });

  // ekspos fungsi untuk fallback halaman keranjang
  window.TokoKu = { getCart, saveCart, addToCart, PRODUCTS };
})();
