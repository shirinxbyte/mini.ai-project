document.getElementById('imageInput').addEventListener('change', function(event) {
    const files = event.target.files;
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.innerHTML = '';

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            imagePreview.appendChild(img);
        };

        reader.readAsDataURL(file);
    }
});

document.getElementById('convertBtn').addEventListener('click', function() {
    const images = document.querySelectorAll('#imagePreview img');
    const pageSpread = document.getElementById('pageSpread').value;
    const borderSize = parseInt(document.getElementById('borderSize').value);
    const borderColor = document.getElementById('borderColor').value;

    const pdf = new jspdf.jsPDF({
        orientation: pageSpread === 'single' ? 'portrait' : 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    images.forEach((img, index) => {
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;
        const aspectRatio = imgWidth / imgHeight;

        const pdfWidth = pdf.internal.pageSize.getWidth() - borderSize * 2;
        const pdfHeight = pdfWidth / aspectRatio;

        if (index > 0) {
            pdf.addPage();
        }

        pdf.setDrawColor(borderColor);
        pdf.setFillColor(borderColor);
        pdf.rect(borderSize, borderSize, pdfWidth, pdfHeight, 'FD');

        pdf.addImage(img, 'JPEG', borderSize, borderSize, pdfWidth, pdfHeight);
    });

    pdf.save('converted.pdf');
});
