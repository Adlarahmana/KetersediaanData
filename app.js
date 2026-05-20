/* ===============================
   CLICK EVENT UNTUK GEOJSON
   Info yang tampil sama hanya muncul sekali
================================ */
map.on('singleclick', function (evt) {
  const hits = [];
  const uniqueInfo = new Set();

  map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
    if (!layer || !layer.getVisible()) return;

    const p = feature.getProperties();
    const layerName = layer.get('name') || 'Data';
    const category = layer.get('category') || 'data';

    let type = layerName;
    let html = '';

    /* ===== LPI ===== */
    if (category === 'lpi') {
      type = `${layerName} (1:${p.SKL || p.SKALA || '-'})`;

      html = `
        <b>Nomor Lembar Peta</b>: ${p.NLP || '-'}<br>
        <b>Skala</b>: ${p.SKL || p.SKALA || '-'}<br>
        <b>Tahun Survei</b>: ${p.THN || p.Tahun || '-'}<br>
        <b>Tahun Publikasi</b>: ${p.EDS || '-'}<br>
        <b>Referensi Datum</b>: ${p.DTH || '-'}<br>
        <b>Jenis Data</b>: Hasil survei oleh ${p.PLK || '-'}<br><br>
      `;
    }

    /* ===== LLN ===== */
    else if (category === 'lln') {
      type = `${layerName} (1:${p.SKL || p.SKALA || '-'})`;

      html = `
        <b>Nomor Lembar Peta</b>: ${p.NLP || '-'}<br>
        <b>Skala</b>: ${p.SKL || p.SKALA || '-'}<br>
        <b>Tahun Survei</b>: ${p.THN || p.Tahun || '-'}<br>
        <b>Tahun Publikasi</b>: ${p.EDS || '-'}<br>
        <b>Referensi Datum</b>: ${p.DTH || '-'}<br>
        <b>Jenis Data</b>: Hasil survei oleh ${p.PLK || '-'}<br><br>
      `;
    }

    /* ===== BATIMETRI ===== */
    else if (category === 'batimetri') {
      type = layerName;

      html = `
        <b>Hasil Survei Data Batimetri</b><br>
        Tahun: ${p.THN || p.Tahun || layerName.replace('Batimetri ', '') || '-'}<br><br>
      `;
    }

    /* ===== LKI ===== */
    else if (category === 'lki') {
      type = layerName;

      html = `
        <b>Data LKI</b><br>
        Tahun: ${p.THN || p.Tahun || layerName.replace('LKI ', '') || '-'}<br><br>
      `;
    }

    /* ===== GARPAN ===== */
    else if (category === 'garpan') {
      type = layerName;

      html = `
        <b>Data Garis Pantai Skala Besar</b><br>
        Tahun: ${p.THN || p.Tahun || layerName.replace('Garpan ', '') || '-'}<br><br>
      `;
    }

    /* ===== DATA LAIN ===== */
    else {
      type = layerName;

      html = `
        <b>${layerName}</b><br>
      `;
    }

    // Kunci unik berdasarkan informasi yang benar-benar tampil di popup
    const cleanHtml = html.replace(/\s+/g, ' ').trim();
    const uniqueKey = `${type}|${cleanHtml}`;

    // Kalau informasi yang tampil sama, jangan ditambahkan lagi
    if (uniqueInfo.has(uniqueKey)) {
      return;
    }

    uniqueInfo.add(uniqueKey);

    hits.push({
      type: type,
      html: html
    });
  });

  if (!hits.length) {
    overlay.setPosition(undefined);
    popup.style.display = 'none';
    return;
  }

  selector.innerHTML = '';
  content.innerHTML = '';

  hits.forEach((h, i) => {
    const btn = document.createElement('div');
    btn.className = 'popup-btn';
    btn.textContent = h.type;

    btn.onclick = () => {
      document.querySelectorAll('.popup-btn')
        .forEach(b => b.classList.remove('active'));

      btn.classList.add('active');
      content.innerHTML = h.html;
    };

    selector.appendChild(btn);

    if (i === 0) {
      btn.classList.add('active');
      content.innerHTML = h.html;
    }
  });

  if (downloadData) {
    downloadData.style.display = 'none';
  }

  popup.style.display = 'block';
  overlay.setPosition(evt.coordinate);
});
