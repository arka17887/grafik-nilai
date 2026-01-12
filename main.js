let slides = document.querySelectorAll(".slide");
let index = 0;

// nilai semester slide 2
let nilai = [0,0,0,0,0];
let chart;

// NEXT slide
function nextSlide(){
  // Slide 1: cek input
  if(index === 0){
    const nama = document.getElementById("nama").value;
    const kelas = document.getElementById("kelas").value;
    const absen = document.getElementById("absen").value;
    if(!nama || !kelas || !absen){
      alert("Isi semua data terlebih dahulu!");
      return;
    }
    document.getElementById("identitas").innerText =
      `${nama} | Kelas ${kelas} | Absen ${absen}`;
  }

  slides[index].classList.remove("active");
  index++;
  if(index >= slides.length) index = slides.length-1;
  slides[index].classList.add("active");

  if(index === 1) buatGrafik();
}

// Slide 2: buat grafik
function buatGrafik(){
  const ctx = document.getElementById("grafikNilai");
  chart = new Chart(ctx,{
    type:"bar",
    data:{
      labels:["Sem 1","Sem 2","Sem 3","Sem 4","Sem 5"],
      datasets:[{
        label:"Nilai",
        data:nilai,
        backgroundColor:["#f87171","#fb923c","#34d399","#60a5fa","#a78bfa"],
        borderRadius:8
      }]
    },
    options:{
      animation:{duration:800},
      scales:{y:{min:0,max:100,ticks:{stepSize:10}}}
    }
  });
}

// Update nilai semester & rata-rata
function updateNilai(){
  for(let i=0;i<5;i++){
    let val = document.getElementById(`sem${i+1}`).value;
    nilai[i] = val ? Number(val) : 0;
  }
  if(chart){
    chart.data.datasets[0].data = nilai;
    chart.update();
  }
  let total = nilai.reduce((a,b)=>a+b,0);
  let count = nilai.filter(n=>n>0).length;
  let rata = count>0 ? (total/count).toFixed(2) : 0;
  document.getElementById("rataRata").innerText = rata;
}

// Slide 3 → Slide 4
function keSlide4(){
  const checked = document.querySelectorAll(".mapel input:checked");
  if(checked.length!==4){
    alert("Harus memilih tepat 4 mata pelajaran!");
    return;
  }

  slides[index].classList.remove("active");
  index++;
  slides[index].classList.add("active");

  const container = document.getElementById("nilaiMapel");
  container.innerHTML = "";

  checked.forEach(mapel=>{
    const box = document.createElement("div");
    box.className="mapel-box";
    let isi = `<h3>${mapel.value}</h3>`;
    for(let s=1;s<=5;s++){
      isi+=`
      <div class="semester">
        <div class="semester-title">Semester ${s}</div>
        <div class="nilai-row">
          <input type="number" placeholder="Ulangan Akhir">
          <input type="number" placeholder="Ulangan Harian">
        </div>
      </div>`;
    }
    box.innerHTML=isi;
    container.appendChild(box);
  });
}

// Slide 4 → Slide 5
function keSlide5(){
  slides[index].classList.remove("active");
  index++;
  slides[index].classList.add("active");

  setTimeout(tampilkanGrafikSlide5,200);
}

// Tampilkan grafik slide 5
function tampilkanGrafikSlide5(){
  const container = document.getElementById('grafikMapelContainer');
  container.innerHTML="";

  const mapelBoxes = document.querySelectorAll('.mapel-box');
  if(mapelBoxes.length===0){
    alert("Isi nilai di slide sebelumnya terlebih dahulu!");
    return;
  }

  mapelBoxes.forEach((box,i)=>{
    const namaMapel = box.querySelector('h3').innerText;
    const inputs = box.querySelectorAll('input');
    let nilaiAkhir=[], nilaiHarian=[];
    for(let j=0;j<inputs.length;j+=2){
      nilaiAkhir.push(Number(inputs[j].value)||0);
      nilaiHarian.push(Number(inputs[j+1].value)||0);
    }

    const wrapper = document.createElement('div');
    wrapper.className='grafik-box';
    const judul=document.createElement('h3');
    judul.innerText=namaMapel;
    wrapper.appendChild(judul);

    const canvasAkhir=document.createElement('canvas');
    const canvasHarian=document.createElement('canvas');
    wrapper.appendChild(canvasAkhir);
    wrapper.appendChild(canvasHarian);

    container.appendChild(wrapper);

    new Chart(canvasAkhir,{
      type:'line',
      data:{
        labels:['Sem 1','Sem 2','Sem 3','Sem 4','Sem 5'],
        datasets:[{
          label:'Ulangan Akhir',
          data:nilaiAkhir,
          borderColor:'#6366f1',
          backgroundColor:'rgba(99,102,241,0.2)',
          fill:true,
          tension:0.3,
          pointRadius:0
        }]
      },
      options:{scales:{y:{min:0,max:100}},responsive:true,animation:{duration:1200}}
    });

    new Chart(canvasHarian,{
      type:'line',
      data:{
        labels:['Sem 1','Sem 2','Sem 3','Sem 4','Sem 5'],
        datasets:[{
          label:'Ulangan Harian',
          data:nilaiHarian,
          borderColor:'#ec4899',
          backgroundColor:'rgba(236,72,153,0.2)',
          fill:true,
          tension:0.3,
          pointRadius:0
        }]
      },
      options:{scales:{y:{min:0,max:100}},responsive:true,animation:{duration:1200}}
    });
  });
}
