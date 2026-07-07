document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const formView = document.getElementById('form-view');
    const previewView = document.getElementById('preview-view');
    const carnetForm = document.getElementById('carnet-form');
    
    // Inputs
    const petRegister = document.getElementById('pet-register');
    const petName = document.getElementById('pet-name');
    const petBreed = document.getElementById('pet-breed');
    const petColor = document.getElementById('pet-color');
    const petBirthdate = document.getElementById('pet-birthdate');
    const petGender = document.getElementById('pet-gender');
    const petSize = document.getElementById('pet-size');
    const petEmission = document.getElementById('pet-emission');
    const petPhoto = document.getElementById('pet-photo');
    
    const ownerName = document.getElementById('owner-name');
    const ownerAddress = document.getElementById('owner-address');
    const ownerDni = document.getElementById('owner-dni');
    const ownerPhone = document.getElementById('owner-phone');
    
    const vacRabies = document.getElementById('vac-rabies');
    const vacComplete = document.getElementById('vac-complete');
    const petAggressive = document.getElementById('pet-aggressive');
    
    // Dropzone Elements
    const photoDropzone = document.getElementById('photo-dropzone');
    const dropzoneContentDefault = document.getElementById('dropzone-content-default');
    const dropzonePreviewContainer = document.getElementById('dropzone-preview-container');
    const photoPreviewImg = document.getElementById('photo-preview-img');
    const btnRemovePhoto = document.getElementById('btn-remove-photo');
    
    // Card Rendering Value Elements
    const cardValRegister = document.getElementById('card-val-register');
    const cardValName = document.getElementById('card-val-name');
    const cardValBreed = document.getElementById('card-val-breed');
    const cardValColor = document.getElementById('card-val-color');
    const cardValBirthdate = document.getElementById('card-val-birthdate');
    const cardValGender = document.getElementById('card-val-gender');
    const cardValSize = document.getElementById('card-val-size');
    const cardValEmission = document.getElementById('card-val-emission');
    const cardPhotoSlot = document.getElementById('card-photo-slot');
    
    const cardValOwner = document.getElementById('card-val-owner');
    const cardValAddress = document.getElementById('card-val-address');
    const cardValDni = document.getElementById('card-val-dni');
    const cardValPhone = document.getElementById('card-val-phone');
    
    // Checkmarks elements on Card
    const markRabiesSi = document.getElementById('card-val-rabies-si');
    const markRabiesNo = document.getElementById('card-val-rabies-no');
    const markCompleteSi = document.getElementById('card-val-complete-si');
    const markCompleteNo = document.getElementById('card-val-complete-no');
    const markAggressiveSi = document.getElementById('card-val-aggressive-si');
    const markAggressiveNo = document.getElementById('card-val-aggressive-no');
    
    // Buttons
    const btnEditData = document.getElementById('btn-edit-data');
    const btnDownloadImg = document.getElementById('btn-download-img');
    const btnDownloadPdf = document.getElementById('btn-download-pdf');
    
    // Application State Variables
    let petPhotoDataUrl = null;

    // ==========================================================================
    // INITIALIZATION & SETUP
    // ==========================================================================
    
    // Prefill Today's Date in emission date
    const today = new Date();
    const formattedToday = formatDate(today);
    petEmission.value = formattedToday;
    
    // Set max date for birthday (cannot be in the future)
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const maxDateString = `${yyyy}-${mm}-${dd}`;
    petBirthdate.setAttribute('max', maxDateString);

    // Numeric input filters (only allow digits in DNI and Cellphone)
    setupNumericInput(ownerDni);
    setupNumericInput(ownerPhone);

    function setupNumericInput(inputElement) {
        inputElement.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }

    // Date formatter helper (returns DD/MM/YYYY)
    function formatDate(dateObj) {
        const d = String(dateObj.getDate()).padStart(2, '0');
        const m = String(dateObj.getMonth() + 1).padStart(2, '0');
        const y = dateObj.getFullYear();
        return `${d}/${m}/${y}`;
    }

    // Convert standard input date (YYYY-MM-DD) to (DD/MM/YYYY)
    function formatInputDate(dateStr) {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    // ==========================================================================
    // PHOTO UPLOAD DRAG AND DROP
    // ==========================================================================
    
    // Trigger file select click when clicking dropzone
    photoDropzone.addEventListener('click', (e) => {
        // Prevent trigger if clicking on the remove button
        if (e.target.closest('#btn-remove-photo')) return;
        petPhoto.click();
    });

    // File input change handler
    petPhoto.addEventListener('change', (e) => {
        handleFileSelect(e.target.files[0]);
    });

    // Drag and drop event handlers
    ['dragenter', 'dragover'].forEach(eventName => {
        photoDropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            photoDropzone.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        photoDropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            photoDropzone.classList.remove('dragover');
        }, false);
    });

    photoDropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && files.length > 0) {
            petPhoto.files = files; // Assign files to file input
            handleFileSelect(files[0]);
        }
    });

    // Handle file reading
    function handleFileSelect(file) {
        if (!file) return;

        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecciona un archivo de imagen válido.');
            return;
        }

        // Validate size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('La imagen es demasiado grande. El tamaño máximo es 5MB.');
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            petPhotoDataUrl = reader.result;
            showPhotoPreview(petPhotoDataUrl);
            clearValidationError(petPhoto);
        };
    }

    function showPhotoPreview(dataUrl) {
        photoPreviewImg.src = dataUrl;
        dropzoneContentDefault.classList.add('hidden');
        dropzonePreviewContainer.classList.remove('hidden');
    }

    // Remove photo handler
    btnRemovePhoto.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        resetPhotoInput();
    });

    function resetPhotoInput() {
        petPhoto.value = '';
        petPhotoDataUrl = null;
        photoPreviewImg.src = '';
        dropzonePreviewContainer.classList.add('hidden');
        dropzoneContentDefault.classList.remove('hidden');
    }

    // ==========================================================================
    // VALIDATIONS & ERROR STYLE TRIGGERS
    // ==========================================================================

    function showValidationError(inputEl, customMsg = null) {
        const parent = inputEl.closest('.form-group');
        if (parent) {
            parent.classList.add('has-error');
            if (customMsg) {
                const errorSpan = parent.querySelector('.error-msg');
                if (errorSpan) errorSpan.textContent = customMsg;
            }
        }
    }

    function clearValidationError(inputEl) {
        const parent = inputEl.closest('.form-group');
        if (parent) {
            parent.classList.remove('has-error');
        }
    }

    // Real-time validation clear on input
    const inputsList = [
        petRegister, petName, petBreed, petColor, 
        petBirthdate, petGender, petSize,
        ownerName, ownerAddress, ownerDni, ownerPhone
    ];

    inputsList.forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                clearValidationError(input);
            }
        });
        
        if (input.tagName === 'SELECT') {
            input.addEventListener('change', () => {
                if (input.value !== '') {
                    clearValidationError(input);
                }
            });
        }
    });

    // Form Submission & Validation
    carnetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        
        // 1. Validate General Required Fields
        inputsList.forEach(input => {
            if (input.value.trim() === '') {
                showValidationError(input);
                isValid = false;
            } else {
                clearValidationError(input);
            }
        });

        // 2. Validate DNI (numeric and 8 digits)
        if (ownerDni.value.trim() !== '') {
            const dniPattern = /^[0-9]{8}$/;
            if (!dniPattern.test(ownerDni.value.trim())) {
                showValidationError(ownerDni, 'El DNI debe tener exactamente 8 dígitos numéricos');
                isValid = false;
            }
        }

        // 3. Validate Cellphone (numeric and min 9 digits)
        if (ownerPhone.value.trim() !== '') {
            if (ownerPhone.value.trim().length < 9) {
                showValidationError(ownerPhone, 'El celular debe tener al menos 9 dígitos');
                isValid = false;
            }
        }

        // 4. Validate Birthdate is date and not future
        if (petBirthdate.value) {
            const birthDateObj = new Date(petBirthdate.value);
            const todayObj = new Date();
            // Reset hours for fair date comparison
            birthDateObj.setHours(0,0,0,0);
            todayObj.setHours(0,0,0,0);
            if (isNaN(birthDateObj.getTime())) {
                showValidationError(petBirthdate, 'Ingresa una fecha de nacimiento válida');
                isValid = false;
            } else if (birthDateObj > todayObj) {
                showValidationError(petBirthdate, 'La fecha de nacimiento no puede ser futura');
                isValid = false;
            }
        }

        // 5. Validate Pet Photo is uploaded
        if (!petPhotoDataUrl) {
            showValidationError(petPhoto);
            isValid = false;
        } else {
            clearValidationError(petPhoto);
        }

        if (!isValid) {
            // Scroll to the first error
            const firstError = document.querySelector('.has-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // If validation succeeds, compile preview and switch view
        generateCarnetPreview();
        switchView(previewView, formView);
    });

    // Helper to switch view panels smoothly
    function switchView(viewToShow, viewToHide) {
        viewToHide.classList.remove('active');
        setTimeout(() => {
            viewToHide.style.display = 'none';
            viewToShow.style.display = 'block';
            setTimeout(() => {
                viewToShow.classList.add('active');
            }, 50);
        }, 400);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ==========================================================================
    // POPULATE CARNET PREVIEW LAYOUT
    // ==========================================================================
    
    function generateCarnetPreview() {
        // Front Carnet
        cardValRegister.textContent = petRegister.value.toUpperCase();
        cardValName.textContent = petName.value;
        cardValBreed.textContent = petBreed.value;
        cardValColor.textContent = petColor.value;
        cardValBirthdate.textContent = formatInputDate(petBirthdate.value);
        cardValGender.textContent = petGender.value;
        cardValSize.textContent = petSize.value;
        cardValEmission.textContent = petEmission.value;
        
        // Render Photo
        cardPhotoSlot.innerHTML = '';
        const petImg = document.createElement('img');
        petImg.src = petPhotoDataUrl;
        petImg.alt = petName.value;
        cardPhotoSlot.appendChild(petImg);
        
        // Back Carnet
        cardValOwner.textContent = ownerName.value;
        cardValAddress.textContent = ownerAddress.value;
        cardValDni.textContent = ownerDni.value;
        cardValPhone.textContent = ownerPhone.value;
        
        // Checkboxes toggles (Rabies)
        if (vacRabies.checked) {
            markRabiesSi.style.display = 'flex';
            markRabiesNo.style.display = 'none';
        } else {
            markRabiesSi.style.display = 'none';
            markRabiesNo.style.display = 'flex';
        }
        
        // Checkboxes toggles (Vaccines Complete)
        if (vacComplete.checked) {
            markCompleteSi.style.display = 'flex';
            markCompleteNo.style.display = 'none';
        } else {
            markCompleteSi.style.display = 'none';
            markCompleteNo.style.display = 'flex';
        }
        
        // Checkboxes toggles (Aggressive)
        if (petAggressive.checked) {
            markAggressiveSi.style.display = 'flex';
            markAggressiveNo.style.display = 'none';
        } else {
            markAggressiveSi.style.display = 'none';
            markAggressiveNo.style.display = 'flex';
        }
    }

    // Return to form to edit data
    btnEditData.addEventListener('click', () => {
        switchView(formView, previewView);
    });

    // ==========================================================================
    // DOWNLOAD ACTIONS (IMAGE & PDF)
    // ==========================================================================

    // Download as Image (PNG)
    btnDownloadImg.addEventListener('click', async () => {
        const petNameVal = petName.value.trim().replace(/\s+/g, '_') || 'mascota';
        btnDownloadImg.disabled = true;
        const originalText = btnDownloadImg.innerHTML;
        btnDownloadImg.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generando PNGs...';

        try {
            // Front image capture
            const frontCanvas = await html2canvas(document.getElementById('card-render-front'), {
                scale: 3, // High resolution scale
                useCORS: true,
                logging: false,
                backgroundColor: null
            });
            
            // Back image capture
            const backCanvas = await html2canvas(document.getElementById('card-render-back'), {
                scale: 3, // High resolution scale
                useCORS: true,
                logging: false,
                backgroundColor: null
            });

            // Trigger download for Front
            downloadCanvas(frontCanvas, `carnet_frontal_${petNameVal}.png`);
            
            // Trigger download for Back (slight delay to prevent browser blockages on multiple downloads)
            setTimeout(() => {
                downloadCanvas(backCanvas, `carnet_trasero_${petNameVal}.png`);
                btnDownloadImg.disabled = false;
                btnDownloadImg.innerHTML = originalText;
            }, 500);

        } catch (error) {
            console.error('Error generating image downloads:', error);
            alert('Hubo un error al generar las imágenes. Por favor intenta de nuevo.');
            btnDownloadImg.disabled = false;
            btnDownloadImg.innerHTML = originalText;
        }
    });

    function downloadCanvas(canvas, filename) {
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Download as PDF
    btnDownloadPdf.addEventListener('click', async () => {
        const petNameVal = petName.value.trim().replace(/\s+/g, '_') || 'mascota';
        btnDownloadPdf.disabled = true;
        const originalText = btnDownloadPdf.innerHTML;
        btnDownloadPdf.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generando PDF...';

        try {
            // Front image capture
            const frontCanvas = await html2canvas(document.getElementById('card-render-front'), {
                scale: 3,
                useCORS: true,
                logging: false
            });
            
            // Back image capture
            const backCanvas = await html2canvas(document.getElementById('card-render-back'), {
                scale: 3,
                useCORS: true,
                logging: false
            });

            const frontImgData = frontCanvas.toDataURL('image/png');
            const backImgData = backCanvas.toDataURL('image/png');

            // CR80 dimensions: 85.6mm x 53.98mm (width x height)
            const cardWidthMM = 85.6;
            const cardHeightMM = 54;

            // Import jsPDF
            const { jsPDF } = window.jspdf;
            
            // Initialize PDF in landscape mode, sized exactly to card dimensions
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: [cardWidthMM, cardHeightMM]
            });

            // Add Front Page
            pdf.addImage(frontImgData, 'PNG', 0, 0, cardWidthMM, cardHeightMM);
            
            // Add Back Page
            pdf.addPage([cardWidthMM, cardHeightMM], 'landscape');
            pdf.addImage(backImgData, 'PNG', 0, 0, cardWidthMM, cardHeightMM);

            // Save PDF
            pdf.save(`carnet_vacunacion_${petNameVal}.pdf`);

            btnDownloadPdf.disabled = false;
            btnDownloadPdf.innerHTML = originalText;

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Hubo un error al generar el PDF. Por favor intenta de nuevo.');
            btnDownloadPdf.disabled = false;
            btnDownloadPdf.innerHTML = originalText;
        }
    });
});
