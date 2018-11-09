// const API_URL = '/example.json?domain=';
const API_URL = 'http://apis.is/isnic?domain=';
const domains = document.querySelector('.domains');
/**
 * Leit að lénum á Íslandi gegnum apis.is
 */
const program = (() => {
  let domainInfo;
  const container = domains.querySelector('.results');

  function emptyContainer() {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  function addToList(dl, title, data) {
    if (data) {
      const dataElement = document.createElement('dt');
      dataElement.appendChild(document.createTextNode(title));
      const dataElementValue = document.createElement('dd');
      dataElementValue.appendChild(document.createTextNode(data));
      dl.appendChild(dataElement);
      dl.appendChild(dataElementValue);
    }
  }

  function displayload() {
    emptyContainer();
    const div = document.createElement('div');
    div.classList.add('loading');
    const img = document.createElement('img');
    img.setAttribute('src', 'loading.gif');
    div.appendChild(img);

    const text = document.createElement('span');
    text.appendChild(document.createTextNode('Leita að léni...'));
    div.appendChild(text);
    container.appendChild(div);
  }

  function formatDate(date) {
    const formatted = date.toISOString().split('T')[0];
    return formatted;
  }
  function displayDomain(domainList) {
    if (domainList.length === 0) {
      displayError('Lén er ekki skráð');
      return;
    }
    const [{
      domain, registered, lastChange, expires,
      registrantname, email, address, country,
    }] = domainList;

    const dl = document.createElement('dl');

    addToList(dl, 'Lén', domain);
    addToList(dl, 'Skráð', formatDate(new Date(registered)));
    addToList(dl, 'Síðast breytt', formatDate(new Date(lastChange)));
    addToList(dl, 'Rennur út', formatDate(new Date(expires)));
    addToList(dl, 'Skráningaraðili', registrantname);
    addToList(dl, 'Netfang', email);
    addToList(dl, 'Heimilisfang', address);
    addToList(dl, 'Land', country);

    emptyContainer();
    container.appendChild(dl);
  }

  function displayError(error) {
    emptyContainer();
    container.appendChild(document.createTextNode(error));
  }

  function fetchData(url) {
    displayload();
    fetch(`${API_URL}${url}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Villa kom upp');
      })
      .then((data) => {
        displayDomain(data.results);
      })
      .catch(() => {
        displayError('Villa við að sækja gögn');
      });
  }

  function onSubmit(e) {
    e.preventDefault();
    const input = e.target.querySelector('input');
    if (input.value.trim() === '') {
      displayError('Lén verður að vera strengur');
      // document.querySelector('input').value = '';
      return;
    }
    fetchData(input.value);
  }

  function init(_domain) {
    domainInfo = _domain;

    const form = domainInfo.querySelector('form');
    form.addEventListener('submit', onSubmit);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  program.init(domains);
});
