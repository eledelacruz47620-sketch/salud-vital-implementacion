// VITAL SALUD - IMPLEMENTACIÓN INTERACTIVA

// Navegación
function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active');
    });

    // Mostrar sección seleccionada
    document.getElementById(sectionId).classList.add('active');

    // Actualizar sidebar
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[onclick="showSection('${sectionId}')"]`).classList.add('active');

    // Scroll al top
    window.scrollTo(0, 0);
}

// CHECKLIST FUNCTIONALITY
class ChecklistManager {
    constructor(checklistId) {
        this.checklistId = checklistId;
        this.checklist = document.getElementById(checklistId);
        this.items = [];
        this.initCheckboxes();
    }

    initCheckboxes() {
        this.checklist.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateProgress());
            this.items.push(checkbox);
        });
        this.updateProgress();
    }

    updateProgress() {
        const completed = this.items.filter(item => item.checked).length;
        const total = this.items.length;
        const percentage = (completed / total) * 100;

        // Actualizar barra de progreso
        const progressFill = this.checklist.querySelector('.progress-fill');
        const progressText = this.checklist.querySelector('.progress-text');

        if (progressFill) {
            progressFill.style.width = percentage + '%';
        }
        if (progressText) {
            progressText.textContent = `${completed} de ${total} completados (${Math.round(percentage)}%)`;
        }

        // Actualizar items completados
        this.checklist.querySelectorAll('.checklist-item').forEach((item, index) => {
            if (this.items[index].checked) {
                item.classList.add('completed');
            } else {
                item.classList.remove('completed');
            }
        });

        // Guardar en localStorage
        localStorage.setItem(this.checklistId, JSON.stringify(
            this.items.map(item => item.checked)
        ));
    }

    loadProgress() {
        const saved = localStorage.getItem(this.checklistId);
        if (saved) {
            const checkedStates = JSON.parse(saved);
            this.items.forEach((item, index) => {
                item.checked = checkedStates[index] || false;
            });
            this.updateProgress();
        }
    }

    reset() {
        this.items.forEach(item => item.checked = false);
        this.updateProgress();
    }
}

// CALCULADORA
class Calculator {
    constructor() {
        this.leadsMonth1 = 7.5; // promedio
        this.leadsMonth2 = 12.5;
        this.leadsMonth3 = 17.5;
        this.conversionMonth1 = 0.20;
        this.conversionMonth2 = 0.30;
        this.conversionMonth3 = 0.35;
        this.avgCommission = 8000; // comisión promedio
        this.teamCost = 0; // primeros 3 meses gratuito
    }

    calculate() {
        // Mes 1
        const month1Conversions = Math.round(this.leadsMonth1 * this.conversionMonth1);
        const month1Income = month1Conversions * this.avgCommission;
        const month1Net = month1Income - this.teamCost;

        // Mes 2
        const month2Conversions = Math.round(this.leadsMonth2 * this.conversionMonth2);
        const month2Income = month2Conversions * this.avgCommission;
        const month2Net = month2Income - this.teamCost;

        // Mes 3
        const month3Conversions = Math.round(this.leadsMonth3 * this.conversionMonth3);
        const month3Income = month3Conversions * this.avgCommission;
        const month3Net = month3Income - this.teamCost;

        // Totales
        const totalLeads = Math.round(this.leadsMonth1 + this.leadsMonth2 + this.leadsMonth3);
        const totalConversions = month1Conversions + month2Conversions + month3Conversions;
        const totalIncome = month1Income + month2Income + month3Income;
        const totalNet = month1Net + month2Net + month3Net;

        return {
            month1: { leads: Math.round(this.leadsMonth1), conversions: month1Conversions, income: month1Income, net: month1Net },
            month2: { leads: Math.round(this.leadsMonth2), conversions: month2Conversions, income: month2Income, net: month2Net },
            month3: { leads: Math.round(this.leadsMonth3), conversions: month3Conversions, income: month3Income, net: month3Net },
            total: { leads: totalLeads, conversions: totalConversions, income: totalIncome, net: totalNet }
        };
    }

    updateUI() {
        const results = this.calculate();

        // Actualizar valores en la UI
        document.getElementById('month1-leads').textContent = results.month1.leads;
        document.getElementById('month1-conversions').textContent = results.month1.conversions;
        document.getElementById('month1-income').textContent = '$' + results.month1.income.toLocaleString('es-MX');

        document.getElementById('month2-leads').textContent = results.month2.leads;
        document.getElementById('month2-conversions').textContent = results.month2.conversions;
        document.getElementById('month2-income').textContent = '$' + results.month2.income.toLocaleString('es-MX');

        document.getElementById('month3-leads').textContent = results.month3.leads;
        document.getElementById('month3-conversions').textContent = results.month3.conversions;
        document.getElementById('month3-income').textContent = '$' + results.month3.income.toLocaleString('es-MX');

        document.getElementById('total-leads').textContent = results.total.leads;
        document.getElementById('total-conversions').textContent = results.total.conversions;
        document.getElementById('total-income').textContent = '$' + results.total.income.toLocaleString('es-MX');
        document.getElementById('total-net').textContent = '$' + results.total.net.toLocaleString('es-MX');
    }
}

// FORMULARIO DE CONTACTO
function handleContactForm(event) {
    event.preventDefault();

    const nombre = document.getElementById('contact-nombre').value;
    const email = document.getElementById('contact-email').value;
    const telefono = document.getElementById('contact-telefono').value;
    const mensaje = document.getElementById('contact-mensaje').value;

    // Validar
    if (!nombre || !email || !telefono) {
        alert('Por favor completa todos los campos requeridos');
        return;
    }

    // Crear mensaje para WhatsApp
    const textoWhatsApp = `Hola, me interesa implementar VITAL SALUD.\n\nNombre: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono}\n\nMensaje: ${mensaje}`;
    const textoEncodado = encodeURIComponent(textoWhatsApp);

    // Mostrar mensaje de éxito
    const form = event.target;
    const successMsg = document.createElement('div');
    successMsg.className = 'alert alert-success';
    successMsg.textContent = '✓ Mensaje enviado. Redirigiendo a WhatsApp...';
    form.parentElement.insertBefore(successMsg, form);

    // Redirigir a WhatsApp después de 1.5 segundos
    setTimeout(() => {
        window.open(`https://wa.me/52TU_NUMERO?text=${textoEncodado}`, '_blank');
    }, 1500);

    // Limpiar formulario
    form.reset();
}

// DESCARGA DE DOCUMENTOS
function downloadDocument(filename) {
    // Simular descarga
    const link = document.createElement('a');
    link.href = `/docs/${filename}`;
    link.download = filename;
    link.click();
}

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar primera sección
    showSection('inicio');

    // Inicializar checklists
    const checklists = ['checklist-semana1', 'checklist-semana2', 'checklist-semana3'];
    checklists.forEach(id => {
        const manager = new ChecklistManager(id);
        manager.loadProgress();
    });

    // Inicializar calculadora
    const calculator = new Calculator();
    calculator.updateUI();

    // Event listeners para inputs de calculadora
    document.getElementById('leads-month1').addEventListener('input', function() {
        calculator.leadsMonth1 = parseFloat(this.value) || 0;
        calculator.updateUI();
    });

    document.getElementById('leads-month2').addEventListener('input', function() {
        calculator.leadsMonth2 = parseFloat(this.value) || 0;
        calculator.updateUI();
    });

    document.getElementById('leads-month3').addEventListener('input', function() {
        calculator.leadsMonth3 = parseFloat(this.value) || 0;
        calculator.updateUI();
    });

    document.getElementById('avg-commission').addEventListener('input', function() {
        calculator.avgCommission = parseFloat(this.value) || 0;
        calculator.updateUI();
    });
});

// FUNCIONES AUXILIARES
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copiado al portapapeles');
    });
}

function exportChecklist(checklistId) {
    const checklist = document.getElementById(checklistId);
    const items = [];
    
    checklist.querySelectorAll('.checklist-item').forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const title = item.querySelector('.checklist-item-title').textContent;
        items.push({
            title: title,
            completed: checkbox.checked
        });
    });

    const csv = items.map(item => `"${item.title}","${item.completed ? 'Completado' : 'Pendiente'}"`).join('\n');
    
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    link.download = `checklist-${checklistId}.csv`;
    link.click();
}

function printPage() {
    window.print();
}
