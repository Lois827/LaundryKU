let orders=JSON.parse(localStorage.getItem("laundryOrders"))||[];let filter="Semua";
const $=id=>document.getElementById(id);
function save(){localStorage.setItem("laundryOrders",JSON.stringify(orders))}
function rupiah(n){return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n)}
function date(d){return new Date(d).toLocaleString("id-ID",{dateStyle:"medium",timeStyle:"short"})}
function esc(t){return String(t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
function render(){
 let q=$("cari").value.toLowerCase();
 let data=orders.filter(o=>(filter==="Semua"||o.status===filter)&&(o.nama.toLowerCase().includes(q)||o.wa.includes(q)));
 $("list").innerHTML="";
 $("kosong").style.display=data.length?"none":"block";
 data.forEach(o=>{
  let late=new Date(o.estimasi)<new Date()&&o.status==="Diproses";
  $("list").insertAdjacentHTML("beforeend",`<div class="order"><div class="name">${esc(o.nama)}</div><div class="info">📱 ${esc(o.wa)}<br>🧺 ${esc(o.jenis)} — ${o.berat} kg<br>💰 ${rupiah(o.harga)}<br>📅 Masuk: ${esc(o.masuk)}<br>⏰ Estimasi selesai: <span class="${late?"late":""}">${date(o.estimasi)}</span>${late?"<br>⚠️ Sudah melewati estimasi":""}${o.catatan?"<br>📝 "+esc(o.catatan):""}</div><span class="badge">${esc(o.status)}</span><div class="actions"><button onclick="next(${o.id})">Ubah Status</button><button class="del" onclick="hapus(${o.id})">Hapus</button></div></div>`)
 });
 $("total").textContent=orders.length;$("proses").textContent=orders.filter(o=>o.status==="Diproses").length;$("selesai").textContent=orders.filter(o=>o.status==="Selesai").length;$("diambil").textContent=orders.filter(o=>o.status==="Sudah Diambil").length;$("jumlah").textContent=data.length+" pesanan";
}
$("form").addEventListener("submit",e=>{e.preventDefault();orders.unshift({id:Date.now(),nama:$("nama").value.trim(),wa:$("wa").value.trim(),jenis:$("jenis").value,berat:Number($("berat").value),harga:Number($("harga").value),estimasi:$("estimasi").value,catatan:$("catatan").value.trim(),status:"Diproses",masuk:new Date().toLocaleString("id-ID")});save();render();e.target.reset();alert("Pesanan berhasil disimpan!")});
function next(id){let o=orders.find(x=>x.id===id);if(!o)return;o.status=o.status==="Diproses"?"Selesai":o.status==="Selesai"?"Sudah Diambil":"Diproses";save();render()}
function hapus(id){if(confirm("Yakin ingin menghapus pesanan ini?")){orders=orders.filter(o=>o.id!==id);save();render()}}
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");filter=b.dataset.filter;render()});
$("cari").addEventListener("input",render);render();