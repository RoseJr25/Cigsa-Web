
document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'cigsa_admin_properties_demo_v1';
  const SESSION_KEY = 'cigsa_admin_demo_session_v2';

  const USERS = [
    {
      email: 'jefa@cig-sa.org',
      password: 'CIGSA-Jefa',
      name: 'Jefa',
      role: 'admin',
      seller: ''
    },
    {
      email: 'rodolfo@cig-sa.org',
      password: 'CIGSA-Rodolfo',
      name: 'Rodolfo',
      role: 'seller',
      seller: 'Rodolfo'
    },
    {
      email: 'aaron@cig-sa.org',
      password: 'CIGSA-Aaron',
      name: 'Aaron',
      role: 'seller',
      seller: 'Aaron'
    }
  ];

  const loginSection = document.getElementById('adminLoginSection');
  const dashboardSection = document.getElementById('adminDashboardSection');
  const loginForm = document.getElementById('adminLoginForm');
  const loginMessage = document.getElementById('adminLoginMessage');
  const logoutButton = document.getElementById('adminLogout');
  const addButton = document.getElementById('adminAddProperty');
  const editor = document.getElementById('adminPropertyEditor');
  const propertyForm = document.getElementById('adminPropertyForm');
  const closeEditorButton = document.getElementById('adminCloseEditor');
  const cancelEditorButton = document.getElementById('adminCancelEditor');
  const searchInput = document.getElementById('adminSearch');
  const sellerFilter = document.getElementById('adminSellerFilter');
  const sellerFilterWrap = document.getElementById('adminSellerFilterWrap');
  const sellerField = document.getElementById('adminPropertySeller');
  const sellerHelp = document.getElementById('adminSellerHelp');
  const tableBody = document.getElementById('adminPropertiesBody');
  const emptyState = document.getElementById('adminEmptyState');
  const editorTitle = document.getElementById('adminEditorTitle');
  const propertyMessage = document.getElementById('adminPropertyMessage');
  const currentUserLabel = document.getElementById('adminCurrentUser');
  const currentRoleLabel = document.getElementById('adminCurrentRole');
  const accessDescription = document.getElementById('adminAccessDescription');

  if (!loginSection || !dashboardSection || !propertyForm || !tableBody) return;

  const defaultProperties = [
    {
      id: 'prop-1',
      name: 'Casa en Costa Verde',
      operation: 'Venta',
      type: 'Casa',
      price: 125000,
      location: 'La Chorrera',
      seller: 'Rodolfo',
      status: 'Disponible',
      published: true,
      archived: false,
      image: ''
    },
    {
      id: 'prop-2',
      name: 'Apartamento en Ciudad de Panamá',
      operation: 'Alquiler',
      type: 'Apartamento',
      price: 900,
      location: 'Ciudad de Panamá',
      seller: 'Aaron',
      status: 'Reservada',
      published: true,
      archived: false,
      image: ''
    },
    {
      id: 'prop-3',
      name: 'Terreno en Arraiján',
      operation: 'Venta',
      type: 'Terreno',
      price: 68000,
      location: 'Arraiján',
      seller: 'Rodolfo',
      status: 'Vendida',
      published: false,
      archived: false,
      image: ''
    }
  ];

  let currentUser = null;

  const loadProperties = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(saved) ? saved : defaultProperties;
    } catch {
      return defaultProperties;
    }
  };

  let properties = loadProperties();

  const saveProperties = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
      return true;
    } catch {
      propertyMessage.textContent = 'No se pudo guardar. Pruebe con una imagen más pequeña.';
      return false;
    }
  };

  const normalize = (value) =>
    String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  const statusClass = (status) => `admin-status-${normalize(status)}`;

  const formatPrice = (property) => {
    const value = Number(property.price || 0).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
    return property.operation === 'Alquiler' ? `$${value}/mes` : `$${value}`;
  };

  const createText = (tag, value, className = '') => {
    const element = document.createElement(tag);
    element.textContent = value;
    if (className) element.className = className;
    return element;
  };

  const createActionButton = (label, action, id) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.dataset.action = action;
    button.dataset.id = id;
    return button;
  };

  const canAccessProperty = (property) =>
    Boolean(currentUser) &&
    (currentUser.role === 'admin' || property.seller === currentUser.seller);

  const accessibleProperties = () =>
    properties.filter((property) => !property.archived && canAccessProperty(property));

  const updateCounts = () => {
    const active = accessibleProperties();
    document.getElementById('adminAvailableCount').textContent =
      active.filter((property) => property.status === 'Disponible').length;
    document.getElementById('adminReservedCount').textContent =
      active.filter((property) => property.status === 'Reservada').length;
    document.getElementById('adminSoldCount').textContent =
      active.filter((property) => property.status === 'Vendida').length;
  };

  const renderProperties = () => {
    if (!currentUser) return;

    const query = normalize(searchInput?.value);
    const selectedSeller =
      currentUser.role === 'admin' ? String(sellerFilter?.value || '') : currentUser.seller;

    const visibleProperties = properties.filter((property) => {
      if (property.archived || !canAccessProperty(property)) return false;
      if (selectedSeller && property.seller !== selectedSeller) return false;
      if (!query) return true;

      return [
        property.name,
        property.location,
        property.seller,
        property.status,
        property.operation,
        property.type
      ].some((value) => normalize(value).includes(query));
    });

    tableBody.replaceChildren();
    emptyState.hidden = visibleProperties.length !== 0;

    visibleProperties.forEach((property) => {
      const row = document.createElement('tr');

      const nameCell = document.createElement('td');
      const nameWrap = document.createElement('div');
      nameWrap.className = 'admin-property-name';

      const thumb = document.createElement('div');
      thumb.className = 'admin-property-thumb';
      if (property.image) {
        const image = document.createElement('img');
        image.src = property.image;
        image.alt = '';
        thumb.appendChild(image);
      } else {
        thumb.textContent = '⌂';
      }

      const nameText = document.createElement('div');
      nameText.append(
        createText('strong', property.name),
        createText('small', `${property.type} · ${property.location}`)
      );
      nameWrap.append(thumb, nameText);
      nameCell.appendChild(nameWrap);

      const priceCell = createText('td', formatPrice(property));

      const statusCell = document.createElement('td');
      statusCell.appendChild(
        createText('span', property.status, `admin-status ${statusClass(property.status)}`)
      );

      const sellerCell = createText('td', property.seller);

      const publicationCell = document.createElement('td');
      publicationCell.appendChild(
        createText(
          'span',
          property.published ? 'Publicada' : 'Oculta',
          `admin-publication ${property.published ? 'admin-publication-visible' : 'admin-publication-hidden'}`
        )
      );

      const actionsCell = document.createElement('td');
      const actions = document.createElement('div');
      actions.className = 'admin-row-actions';
      actions.append(
        createActionButton('Editar', 'edit', property.id),
        createActionButton(property.published ? 'Ocultar' : 'Publicar', 'toggle', property.id),
        createActionButton('Archivar', 'archive', property.id)
      );
      actionsCell.appendChild(actions);

      row.append(nameCell, priceCell, statusCell, sellerCell, publicationCell, actionsCell);
      tableBody.appendChild(row);
    });

    updateCounts();
  };

  const resetEditor = () => {
    propertyForm.reset();
    document.getElementById('adminPropertyId').value = '';
    document.getElementById('adminPropertyPublished').checked = true;
    editorTitle.textContent = 'Agregar propiedad';
    propertyMessage.textContent = '';

    if (currentUser?.role === 'seller') {
      sellerField.value = currentUser.seller;
      sellerField.disabled = true;
      sellerHelp.textContent = 'La propiedad quedará asignada automáticamente a su usuario.';
    } else {
      sellerField.disabled = false;
      sellerHelp.textContent = 'La administradora puede asignar la propiedad a cualquier vendedor.';
    }
  };

  const openEditor = (property = null) => {
    resetEditor();

    if (property) {
      if (!canAccessProperty(property)) {
        window.alert('No tiene permiso para modificar esta propiedad.');
        return;
      }

      editorTitle.textContent = 'Editar propiedad';
      document.getElementById('adminPropertyId').value = property.id;
      document.getElementById('adminPropertyName').value = property.name;
      document.getElementById('adminPropertyOperation').value = property.operation;
      document.getElementById('adminPropertyType').value = property.type;
      document.getElementById('adminPropertyPrice').value = property.price;
      document.getElementById('adminPropertyLocation').value = property.location;
      sellerField.value = property.seller;
      document.getElementById('adminPropertyStatus').value = property.status;
      document.getElementById('adminPropertyPublished').checked = property.published;
    }

    editor.hidden = false;
    editor.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const closeEditor = () => {
    editor.hidden = true;
    resetEditor();
  };

  const readImage = (file) =>
    new Promise((resolve, reject) => {
      if (!file) {
        resolve('');
        return;
      }

      if (file.size > 1024 * 1024) {
        reject(new Error('La imagen debe pesar menos de 1 MB.'));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
      reader.readAsDataURL(file);
    });

  const applyUserAccess = () => {
    if (!currentUser) return;

    currentUserLabel.textContent = currentUser.name;
    currentRoleLabel.textContent =
      currentUser.role === 'admin' ? 'Administradora · acceso completo' : 'Vendedor · acceso limitado';

    if (currentUser.role === 'admin') {
      sellerFilterWrap.hidden = false;
      accessDescription.textContent =
        'Puede ver y modificar las propiedades de todos los vendedores.';
    } else {
      sellerFilterWrap.hidden = true;
      sellerFilter.value = '';
      accessDescription.textContent =
        `Solo puede ver y modificar las propiedades asignadas a ${currentUser.seller}.`;
    }

    loginSection.hidden = true;
    dashboardSection.hidden = false;
    closeEditor();
    renderProperties();
  };

  const saveSession = () => {
    if (!currentUser) return;
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ email: currentUser.email })
    );
  };

  const restoreSession = () => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY));
      const user = USERS.find((item) => item.email === saved?.email);
      if (!user) return false;
      currentUser = user;
      applyUserAccess();
      return true;
    } catch {
      return false;
    }
  };

  loginForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('adminEmail').value.trim().toLowerCase();
    const password = document.getElementById('adminPassword').value;

    const user = USERS.find(
      (item) => item.email.toLowerCase() === email && item.password === password
    );

    if (!user) {
      loginMessage.textContent = 'Correo o contraseña incorrectos.';
      return;
    }

    currentUser = user;
    loginMessage.textContent = '';
    saveSession();
    applyUserAccess();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  logoutButton?.addEventListener('click', () => {
    currentUser = null;
    sessionStorage.removeItem(SESSION_KEY);
    dashboardSection.hidden = true;
    loginSection.hidden = false;
    loginForm.reset();
    closeEditor();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  addButton?.addEventListener('click', () => openEditor());
  closeEditorButton?.addEventListener('click', closeEditor);
  cancelEditorButton?.addEventListener('click', closeEditor);
  searchInput?.addEventListener('input', renderProperties);
  sellerFilter?.addEventListener('change', renderProperties);

  tableBody.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const property = properties.find((item) => item.id === button.dataset.id);
    if (!property || !canAccessProperty(property)) {
      window.alert('No tiene permiso para modificar esta propiedad.');
      return;
    }

    if (button.dataset.action === 'edit') {
      openEditor(property);
    }

    if (button.dataset.action === 'toggle') {
      property.published = !property.published;
      saveProperties();
      renderProperties();
    }

    if (button.dataset.action === 'archive') {
      const confirmed = window.confirm(`¿Archivar “${property.name}”?`);
      if (!confirmed) return;
      property.archived = true;
      saveProperties();
      renderProperties();
      closeEditor();
    }
  });

  propertyForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!currentUser) return;

    propertyMessage.textContent = '';

    const id = document.getElementById('adminPropertyId').value;
    const existing = properties.find((property) => property.id === id);

    if (existing && !canAccessProperty(existing)) {
      propertyMessage.textContent = 'No tiene permiso para modificar esta propiedad.';
      return;
    }

    const imageFile = document.getElementById('adminPropertyImage').files[0];
    let image = existing?.image || '';

    try {
      if (imageFile) image = await readImage(imageFile);
    } catch (error) {
      propertyMessage.textContent = error.message;
      return;
    }

    const assignedSeller =
      currentUser.role === 'seller' ? currentUser.seller : sellerField.value;

    const propertyData = {
      id: id || `prop-${Date.now()}`,
      name: document.getElementById('adminPropertyName').value.trim(),
      operation: document.getElementById('adminPropertyOperation').value,
      type: document.getElementById('adminPropertyType').value,
      price: Number(document.getElementById('adminPropertyPrice').value),
      location: document.getElementById('adminPropertyLocation').value.trim(),
      seller: assignedSeller,
      status: document.getElementById('adminPropertyStatus').value,
      published: document.getElementById('adminPropertyPublished').checked,
      archived: false,
      image
    };

    if (existing) {
      Object.assign(existing, propertyData);
    } else {
      properties.unshift(propertyData);
    }

    if (!saveProperties()) return;

    renderProperties();
    propertyMessage.textContent = 'Propiedad guardada correctamente.';

    window.setTimeout(() => {
      closeEditor();
    }, 650);
  });

  if (!restoreSession()) {
    loginSection.hidden = false;
    dashboardSection.hidden = true;
  }
});
