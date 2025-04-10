document.addEventListener('DOMContentLoaded', function () {
    const dataInput = document.getElementById('data');
    const horaSelect = document.getElementById('hora');
    const telefoneInput = document.getElementById('telefone');
    const hoje = new Date();

    // Formata data para YYYY-MM-DD
    const formatarData = (date) => {
        const offset = date.getTimezoneOffset();
        date = new Date(date.getTime() - (offset * 60 * 1000));
        return date.toISOString().split('T')[0];
    };

    // Define data mínima como hoje
    dataInput.min = formatarData(hoje);
    

    // Máscara de telefone
    telefoneInput.addEventListener('input', function (e) {
        let valor = e.target.value.replace(/\D/g, '');

        if (valor.length > 11) valor = valor.slice(0, 11)

        if (valor.length >= 2 && valor.length <= 6) {
            valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`
        } else if (valor.length > 6 && valor.length <= 10) {
            valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 6)}-${valor.slice(6)}`
        } else if (valor.length > 10) {
            valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`
        }

        e.target.value = valor
    })

    // Envio do formulário
    document.getElementById('agendamentoForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value;
        const telefone = document.getElementById('telefone').value;
        const servico = document.getElementById('servico').value;
        const data = document.getElementById('data').value;
        const hora = document.getElementById('hora').value;

        if (!nome || !telefone || !servico || !data || !hora) {
            alert('Por favor, preencha todos os campos corretamente!');
            return;
        }

        const [year, month, day] = data.split('-');
        const [hour, minute] = hora.split(':');
        const startDate = new Date(year, month - 1, day, hour, minute);
        const endDate = new Date(startDate);

        // Duração por tipo de serviço
        if (servico.includes("Design") || servico.includes("Manicure") || servico.includes("Pedicure")) {
            endDate.setHours(endDate.getHours(), endDate.getMinutes() + 30);
        } else if (servico.includes("Coloração") || servico.includes("Podologia")) {
            endDate.setHours(endDate.getHours() + 2);
        } else {
            endDate.setHours(endDate.getHours() + 1);
        }

        // Mapeamento de serviços para e-mails
        const profissionalEmails = {
            "Manicure": "manicure@email.com",
            "Design": "design@email.com",
            "Pedicure": "pedicure@email.com",
            "Coloração": "coloracao@email.com",
            "Podologia": "podologia@email.com"
        };

        let profissionalEmail = "mryan2509@gmail.com"; // padrão
        for (const key in profissionalEmails) {
            if (servico.includes(key)) {
                profissionalEmail = profissionalEmails[key];
                break;
            }
        }

        // Link do Google Calendar com convidado
        const startISO = startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
        const endISO = endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
        const googleCalendarUrl =
            `https://www.google.com/calendar/render?action=TEMPLATE` +
            `&text=${encodeURIComponent(servico)}` +
            `&dates=${startISO}/${endISO}` +
            `&details=Cliente: ${encodeURIComponent(nome)}%0ATelefone: ${encodeURIComponent(telefone)}` +
            `&location=${encodeURIComponent("Nanda - Shalon Adonai")}` +
            `&add=${encodeURIComponent(profissionalEmail)}` +
            `&sf=true&output=xml`;

        document.getElementById('confirmacaoTexto').textContent =
            `Olá ${nome}, seu agendamento para ${servico} no dia ${day}/${month}/${year} às ${hora} foi confirmado!`;
        document.getElementById('googleCalendarLink').href = googleCalendarUrl;

        new bootstrap.Modal(document.getElementById('confirmacaoModal')).show();
    });
});
