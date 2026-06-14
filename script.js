document.getElementById('attestationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('fullName').value;
    const btn = document.getElementById('generateBtn');
    const originalBtnText = btn.innerHTML;
    
    // Set loading state
    btn.disabled = true;
    btn.innerHTML = `<i data-lucide="loader-circle" class="btn-icon spin"></i> <span class="btn-text">Génération...</span>`;
    if (typeof lucide !== 'undefined') lucide.createIcons();
    
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape');
    
    // Palette de couleurs premium
    const primaryColor = [39, 39, 42];     // #27272A - Anthracite profond
    const secondaryColor = [113, 113, 122]; // #71717A - Gris élégant
    const accentColor = [94, 106, 210];    // #5E6AD2 - Couleur d'accentuation
    
    const centerX = 148.5; // Centre de la page A4 Paysage

    // --- BORDURES ---
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.rect(12, 12, 273, 186);
    
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setLineWidth(0.2);
    doc.rect(14, 14, 269, 182);

    // Charger le logo depuis le dossier racine "images"
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = 'images/aorte_logo.png';
    
    return new Promise((resolve) => {
        let finished = false;
        const generate = (useLogo) => {
            if (finished) return;
            finished = true;
            
            // --- EN-TÊTE AUTOMATISÉ (TEXTE + LOGO) ---
            doc.setFont("helvetica", "bold");
            doc.setFontSize(18);
            doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]); // Couleur d'accentuation
            
            const companyName = "Aorte Learn"; // Écrit strictement en minuscule
            const textWidth = doc.getTextWidth(companyName);
            
            // Configuration géométrique du bloc de marque
            const logoWidth = 8;  // Largeur du logo en mm
            const logoHeight = 8; // Hauteur du logo en mm
            
            // Conversion stricte de 6px en mm (1 px = 0.264583 mm)
            const spacing = 6 * 0.264583; // Environ 1.587 mm
            
            const yBaseline = 35; // Position verticale de la ligne de texte
            
            if (useLogo) {
                // Calcul de la largeur totale du bloc pour un centrage parfait dans la page
                const totalBlockWidth = textWidth + spacing + logoWidth;
                const startX = centerX - (totalBlockWidth / 2);
                
                // Conversion de l'image en Base64 pour jsPDF
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const dataURL = canvas.toDataURL('image/png');

                doc.addImage(dataURL, 'PNG', startX + textWidth + spacing, yBaseline - 6.2, logoWidth, logoHeight);
                doc.setFont("courier", "italic"); 
                doc.setFontSize(20);
                doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
                doc.text(companyName, startX, yBaseline);
            } else {
                // Rempli uniquement le texte centré si le logo ne charge pas
                doc.text(companyName, centerX, yBaseline, { align: "center" });
            }

            // --- TITRE DU CERTIFICAT ---
            doc.setFont("helvetica", "bold");
            doc.setFontSize(28);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text("CERTIFICAT D'ACCOMPLISSEMENT", centerX, 70, { align: "center" });

            // Ligne fine sous le titre
            doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
            doc.setLineWidth(0.5);
            doc.line(centerX - 30, 78, centerX + 30, 78);

            // --- CORPS ---
            doc.setFont("helvetica", "normal");
            doc.setFontSize(14);
            doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            doc.text("DÉCERNÉ À", centerX, 100, { align: "center" });

            // Nom du bénéficiaire
            doc.setFont("helvetica", "bold");
            doc.setFontSize(42);
            doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
            doc.text(name.toUpperCase(), centerX, 120, { align: "center" });

            // Texte de validation
            doc.setFont("helvetica", "italic");
            doc.setFontSize(16);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text("Pour avoir complété avec succès le programme de formation Aorte.", centerX, 140, { align: "center" });

            // --- SIGNATURES & DATES ---
            const today = new Date().toLocaleDateString('fr-FR');
            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);

            // Date
            doc.text(today, 60, 168, { align: "center" });
            doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            doc.setLineWidth(0.3);
            doc.line(40, 172, 80, 172);
            doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            doc.text("Date", 60, 178, { align: "center" });

            // Signature
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text("La Direction", 237, 168, { align: "center" });
            doc.line(217, 172, 257, 172);
            doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            doc.text("Signature", 237, 178, { align: "center" });

            // --- FOOTER ---
            doc.setFontSize(10);
            doc.setTextColor(161, 161, 170);
            doc.text("www.aorte.africa", centerX, 192, { align: "center" });

            // Sauvegarde du fichier
            doc.save(`Attestation_${name.replace(/\s+/g, '_')}.pdf`);
            resolve();
        };

        img.onload = () => generate(true);
        img.onerror = () => generate(false); 
        setTimeout(() => generate(false), 3000);
        
    }).then(() => {
        // Reset button state
        btn.disabled = false;
        btn.innerHTML = originalBtnText;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    });
});