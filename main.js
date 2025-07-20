const form = document.getElementById('nameForm');
const input = document.getElementById('nameInput');
const results = document.getElementById('results');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = input.value.trim();
  if (!name) return;

  results.innerHTML = `<p class="text-center text-gray-500">Loading...</p>`;

  try {
    const res = await fetch(`https://api.nationalize.io/?name=${name}`);
    const data = await res.json();
    renderResults(data);
  } catch (err) {
    results.innerHTML = `<p class="text-red-500 text-center">Error fetching data.</p>`;
  }
});

function renderResults(data) {
  if (!data.country || !data.country.length) {
    results.innerHTML = `<p class="text-center text-gray-500">"${data.name}" uchun ma'lumot topilmadi.</p>`;
    return;
  }

  const countries = [...data.country]
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 10);

  results.innerHTML = `
    <h2 class="text-xl font-semibold mb-2">Ism: <span class="text-blue-600">${data.name}</span></h2>
    <ul class="space-y-2">
      ${countries.map((c, i) => {
        const percent = (c.probability * 100).toFixed(2);
        const flag = `https://flagcdn.com/24x18/${c.country_id.toLowerCase()}.png`;
        return `
          <li class="flex items-center justify-between p-3 rounded bg-white dark:bg-gray-800 border dark:border-gray-700">
            <div class="flex items-center gap-2">
              <img src="${flag}" alt="${c.country_id}" class="w-5 h-auto">
              <span class="font-medium">${i + 1}. ${c.country_id}</span>
            </div>
            <div class="flex-1 mx-4 h-2 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
              <div class="h-full bg-blue-600" style="width:${percent}%;"></div>
            </div>
            <span class="text-sm font-mono">${percent}%</span>
          </li>
        `;
      }).join('')}
    </ul>
  `;
}
;
