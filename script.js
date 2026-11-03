// NetGuard: exemplos educativos de lógica e programação.
const $ = (s) => document.querySelector(s);

function ipToNumber(ip) {
  const parts = ip.trim().split(".");
  if (parts.length !== 4) return null;
  let result = 0;
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null;
    const n = Number(part);
    if (n < 0 || n > 255) return null;
    result = result * 256 + n;
  }
  return result >>> 0;
}

function numberToIp(n) {
  return [24,16,8,0].map(shift => (n >>> shift) & 255).join(".");
}

function calculateNetwork() {
  const ip = ipToNumber($("#ip").value);
  const prefix = Number($("#cidr").value);
  const feedback = $("#network-feedback");

  if (ip === null) {
    feedback.textContent = "IPv4 inválido. Use o formato 192.168.1.10.";
    feedback.classList.add("error");
    return;
  }

  const mask = prefix === 0 ? 0 : (0xFFFFFFFF << (32-prefix)) >>> 0;
  const network = (ip & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;

  let hosts = Math.max(0, 2 ** (32-prefix) - 2);
  if (prefix === 31) hosts = 2;
  if (prefix === 32) hosts = 1;

  $("#network").textContent = numberToIp(network);
  $("#broadcast").textContent = numberToIp(broadcast);
  $("#mask").textContent = numberToIp(mask);
  $("#hosts").textContent = hosts.toLocaleString("pt-BR");

  feedback.textContent = `Cálculo concluído para ${$("#ip").value}/${prefix}.`;
  feedback.classList.remove("error");
}

$("#calc-network").addEventListener("click", calculateNetwork);
$("#ip").addEventListener("keydown", e => {
  if (e.key === "Enter") calculateNetwork();
});

function updateSecurity() {
  const checks = [...document.querySelectorAll(".check")];
  const done = checks.filter(c => c.checked).length;

  $("#score").textContent = `${done} de ${checks.length}`;
  $("#security-summary").textContent = `${done}/${checks.length}`;
  $("#security-bar").style.width = `${done/checks.length*100}%`;
}

document.querySelectorAll(".check").forEach(c =>
  c.addEventListener("change", updateSecurity)
);

function calculateStorage() {
  const total = Number($("#capacity").value);
  const used = Number($("#used").value);
  const feedback = $("#storage-feedback");

  if (!Number.isFinite(total) || !Number.isFinite(used) ||
      total <= 0 || used < 0 || used > total) {
    feedback.textContent = "A capacidade deve ser maior que zero e o uso não pode ultrapassá-la.";
    feedback.classList.add("error");
    return;
  }

  const free = total-used;
  const percent = used/total*100;

  $("#used-label").textContent = `${used} GB`;
  $("#free-label").textContent = `${free} GB`;
  $("#percent").textContent = `${percent.toFixed(1).replace(".",",")}%`;
  $("#storage-summary").textContent = `${Math.round(percent)}%`;
  $("#storage-bar").style.width = `${percent}%`;

  feedback.textContent = "Simulação atualizada com sucesso.";
  feedback.classList.remove("error");
}

$("#calc-storage").addEventListener("click", calculateStorage);
$("#capacity").addEventListener("input", calculateStorage);
$("#used").addEventListener("input", calculateStorage);

calculateNetwork();
updateSecurity();
calculateStorage();