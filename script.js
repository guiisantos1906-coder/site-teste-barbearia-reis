const nav=document.getElementById('nav');const toggle=document.getElementById('menuToggle');toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'✕':'☰'});document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰'}));document.getElementById('year').textContent=new Date().getFullYear();
const dialog=document.getElementById('lightbox');const lightboxImage=document.getElementById('lightboxImage');document.querySelectorAll('.gallery-item').forEach(item=>item.addEventListener('click',()=>{lightboxImage.src=item.dataset.img;lightboxImage.alt=item.querySelector('img').alt;dialog.showModal()}));document.getElementById('closeLightbox').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b===button));document.querySelectorAll('.gallery-item').forEach(item=>item.hidden=button.dataset.filter!=='todos'&&item.dataset.category!==button.dataset.filter)}));
const dateInput={value:'',min:''};const localToday=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};dateInput.min=localToday();
const form=document.getElementById('bookingForm'),feedback=document.getElementById('bookingFeedback'),result=document.getElementById('bookingResult'),output=document.getElementById('messageOutput');let currentStep=1;
let selectedSlot='';const selectedProfessional=()=>document.querySelector('input[name="professional"]:checked')?.value||'';
let selectedDay=new Date();selectedDay.setHours(12,0,0,0);
const formatDay=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
function updateDay(){const today=new Date();today.setHours(12,0,0,0);document.getElementById('selectedDayLabel').textContent=selectedDay.toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'2-digit'});document.getElementById('dayPrev').disabled=selectedDay<=today;dateInput.value=formatDay(selectedDay);clearSlotSelection()}
document.getElementById('dayPrev').addEventListener('click',()=>{selectedDay.setDate(selectedDay.getDate()-1);updateDay()});
document.getElementById('dayNext').addEventListener('click',()=>{selectedDay.setDate(selectedDay.getDate()+1);updateDay()});updateDay();
const chosen=()=>document.querySelector('input[name="chosenService"]:checked')?.value||'';
function showStep(step){currentStep=step;document.querySelectorAll('.wizard-step').forEach(el=>el.hidden=Number(el.dataset.step)!==step);document.getElementById('stepCounter').textContent=`ETAPA ${step} DE 3`;document.getElementById('progressFill').style.width=`${step/3*100}%`;document.getElementById('prevStep').hidden=step===1;document.getElementById('nextStep').hidden=step===3;document.getElementById('finishBooking').hidden=step!==3;feedback.textContent='';result.hidden=true;if(step===2){document.querySelectorAll('.selected-service-label').forEach(el=>el.textContent=chosen());updateDay()}if(step===3){document.getElementById('bookingSummary').textContent=`Serviço: ${chosen()} • Profissional: ${selectedProfessional()} • Data: ${selectedDay.toLocaleDateString('pt-BR')} • Horário desejado: ${selectedSlot}`;document.getElementById('time').value=selectedSlot;}}
document.querySelectorAll('.service-info').forEach(button=>button.addEventListener('click',()=>{const detail=button.nextElementSibling;detail.hidden=!detail.hidden;button.setAttribute('aria-expanded',String(!detail.hidden));button.textContent=detail.hidden?'Saiba mais':'Mostrar menos'}));
document.getElementById('nextStep').addEventListener('click',()=>{if(currentStep===1&&!chosen()){feedback.textContent='Selecione um serviço para continuar.';return}if(currentStep===2&&(!selectedProfessional()||!selectedSlot)){feedback.textContent='Escolha um profissional e um horário de preferência.';return}if(currentStep===2&&selectedDay.getDay()===0){feedback.textContent='Selecione um dia de segunda a sábado.';return}showStep(currentStep+1)});
document.getElementById('prevStep').addEventListener('click',()=>showStep(currentStep-1));
form.addEventListener('submit',e=>{e.preventDefault();feedback.textContent='';const name=document.getElementById('clientName').value.trim(),service=chosen(),date=dateInput.value,time=selectedSlot;if(!name||!service||!selectedProfessional()||!date||!time){feedback.textContent='Preencha a data e o horário de preferência.';return}if(date<localToday()){feedback.textContent='Escolha uma data de hoje em diante.';return}const [y,m,d]=date.split('-').map(Number),day=new Date(y,m-1,d);if(day.getFullYear()!==y||day.getMonth()!==m-1||day.getDate()!==d){feedback.textContent='Data inválida.';return}if(day.getDay()===0){feedback.textContent='O atendimento informado é de segunda a sábado. Escolha outro dia.';return}output.value=`Olá, Barbearia Rei's! Gostaria de solicitar um horário.\n\nNome: ${name}\nServiço: ${service}\nProfissional desejado: ${selectedProfessional()}\nData de preferência: ${day.toLocaleDateString('pt-BR')}\nHorário de preferência: ${time}\n\nVocês têm disponibilidade?`;result.hidden=false;feedback.textContent='Solicitação preparada. Copie e envie pelo Instagram; o horário depende de confirmação.';result.scrollIntoView({behavior:'smooth',block:'nearest'})});
document.getElementById('copyMessage').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(output.value);feedback.textContent='Mensagem copiada! Agora envie pelo Instagram.'}catch{output.focus();output.select();feedback.textContent='Selecione e copie a mensagem para enviar pelo Instagram.'}});

// Ao abrir uma categoria, recolhe as demais.
document.querySelectorAll('.booking-category').forEach(category=>{
  category.addEventListener('toggle',()=>{
    if(category.open){document.querySelectorAll('.booking-category').forEach(other=>{if(other!==category)other.open=false;});}
  });
});

// Horários por profissional: opções demonstrativas, não agenda em tempo real.
function clearSlotSelection(){selectedSlot='';document.querySelectorAll('.slot-button').forEach(b=>{b.classList.remove('selected');b.setAttribute('aria-pressed','false')});}
document.querySelectorAll('.pro-accordion').forEach(accordion=>{
 const label=accordion.querySelector('.pro-card');const input=label.querySelector('input');
 label.addEventListener('click',()=>{
  if(!input.checked){input.checked=true;}
  document.querySelectorAll('.pro-accordion').forEach(other=>{other.querySelector('.pro-slots').hidden=other!==accordion;other.classList.toggle('expanded',other===accordion)});
  clearSlotSelection();feedback.textContent='';
 });
 accordion.querySelectorAll('.slot-button').forEach(button=>button.addEventListener('click',()=>{
  input.checked=true;selectedSlot=button.dataset.time;
  document.querySelectorAll('.slot-button').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button))});
  feedback.textContent='Horário de preferência selecionado. A disponibilidade será confirmada pela barbearia.';
 }));
});
