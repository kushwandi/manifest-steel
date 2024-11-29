const dummyManifest = [
    { id: 1, no: "405", vendor: "ttmi", sprints: "success", ifast: "Y" },
    { id: 2, no: "406", vendor: "ttmi", sprints: "success", ifast: "Y" },
    { id: 3, no: "407", vendor: "ssk", sprints: "success", ifast: "Y" },
    { id: 4, no: "408", vendor: "ssk", sprints: "error", ifast: "N" },
    { id: 5, no: "409", vendor: "ssk", sprints: "success", ifast: "Y" }
];

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = './index.html';
        return;
    }

    // Set user email in navbar
    const userEmail = localStorage.getItem('emailLogin');
    document.getElementById('userEmail').textContent = formatEmail(userEmail);

     // Initialize manifests data
     if (!localStorage.getItem('manifest')) {
        localStorage.setItem('manifest', JSON.stringify(dummyManifest));
    }

    const manifest = JSON.parse(localStorage.getItem('manifest'));
    const vendor = [...new Set(manifest.map(emp => emp.vendor))];

    // Update statistics
    document.getElementById('totalManifest').textContent = manifest.length;
    document.getElementById('totalVendor').textContent = vendor.length;

    // Function to render table rows
    function renderManifests(manifestData) {
        const tableBody = document.getElementById('manifestTableBody');
        tableBody.innerHTML = manifestData.map(emp => `
            <tr>
                <td>${emp.id}</td>
                <td>${emp.no}</td>
                <td><span class="badge bg-info department-badge">${emp.vendor}</span></td>
                <td>${emp.sprints}</td>
                <td><span class="badge bg-success status-badge">${emp.ifast}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" data-id="${emp.id}" onclick="editManifest(${emp.id})">Edit</button>
                    <button class="btn btn-sm btn-outline-danger" data-id="${emp.id}" onclick="deleteManifest(${emp.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    // Initial render
    renderManifests(manifest);

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredManifest = manifest.filter(emp => 
            emp.no.toLowerCase().includes(searchTerm) || 
            emp.vendor.toLowerCase().includes(searchTerm) ||
            emp.sprints.toLowerCase().includes(searchTerm)
        );
        renderManifests(filteredManifests);
    });

    // Handle logout
    document.getElementById('logoutButton').addEventListener('click', function() {
        localStorage.removeItem('emailLogin');
        sessionStorage.removeItem('isLoggedIn');
        // localStorage.clear();
        window.location.href = './index.html';
    });

    // Function to show alert
    function showAlert(message, type = 'success') {
        const alert = document.getElementById(`${type}Alert`);
        alert.style.display = 'block';
        alert.classList.add('show');
        
        setTimeout(() => {
            alert.style.display = 'none';
            alert.classList.remove('show');
        }, 3000);
    }

    // Function to validate form
    function validateForm(form) {
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return false;
        }
        return true;
    }

    // Function to add new manifest
    function addManifest() {
        const form = document.getElementById('addManifestForm');
        
        if (!validateForm(form)) {
            return;
        }

        const manifest = JSON.parse(localStorage.getItem('manifest')) || [];
        
        const newManifest = {
            id: manifest.length + 1,
            no: document.getElementById('manifestno').value,
            vendor: document.getElementById('manifestvendor').value,
            sprints: document.getElementById('manifestsprints').value,
            ifast: document.getElementById('manifestIfast').value
        };

        manifest.push(newManifest);
        localStorage.setItem('manifest', JSON.stringify(manifest));

        // Update statistics
        document.getElementById('totalManifest').textContent = manifest.length;
        const vendor = [...new Set(manifest.map(emp => emp.vendor))];
        document.getElementById('totalVendor').textContent = vendor.length;

        // Re-render table
        renderManifests(manifest);

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addManifestModal'));
        modal.hide();

        // Reset form
        form.reset();
        form.classList.remove('was-validated');

        // Show success message
        showAlert('Manifest added successfully!');
    }

    // Add event listener for save button
    document.getElementById('saveManifest').addEventListener('click', addManifest);

    // Reset form when modal is closed
    document.getElementById('addManifestModal').addEventListener('hidden.bs.modal', function() {
        const form = document.getElementById('addManifestForm');
        form.reset();
        form.classList.remove('was-validated');
    });

     // Edit manifest function
     editManifest = function(id) {
        const manifests = JSON.parse(localStorage.getItem('manifest'));
        const manifest = manifests.find(emp => emp.id === id);
        
        if (manifest) {
            document.getElementById('editManifestId').value = manifest.id;
            document.getElementById('editManifestNo').value = manifest.no;
            document.getElementById('editManifestVendor').value = manifest.vendor;
            document.getElementById('editManifestSprints').value = manifest.sprints;
            document.getElementById('editManifestIfast').value = manifest.ifast;
            
            const editModal = new bootstrap.Modal(document.getElementById('editManifestModal'));
            editModal.show();
        }
    }

      // Update manifest function
    function updateManifest() {
        const form = document.getElementById('editManifestForm');
        
        if (!validateForm(form)) {
            return;
        }

        const manifests = JSON.parse(localStorage.getItem('manifest'));
        const id = parseInt(document.getElementById('editManifestId').value);
        const index = manifests.findIndex(emp => emp.id === id);
        
        if (index !== -1) {
            manifest[index] = {
                id: id,
                no: document.getElementById('editManifestNo').value,
                vendor: document.getElementById('editManifestVendor').value,
                sprints: document.getElementById('editManifestSprints').value,
                ifast: document.getElementById('editManifestIfast').value
            };
            
            localStorage.setItem('manifest', JSON.stringify(manifest));
            
            // Update statistics
            const vendor = [...new Set(manifest.map(emp => emp.vendor))];
            document.getElementById('totalVendor').textContent = vendor.length;
            
            // Re-render table
            renderManifests(manifest);
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editManifestModal'));
            modal.hide();
            
            // Show success message
            showAlert('Manifest updated successfully!', 'editSuccess');
        }
    }

    // Delete manifest function
    deleteManifest = function(id) {
        document.getElementById('deleteManifestId').value = id;
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteManifestModal'));
        deleteModal.show();
    }

    // Confirm delete function
    function confirmDeleteManifest() {
        const id = parseInt(document.getElementById('deleteManifestId').value);
        let manifest = JSON.parse(localStorage.getItem('manifest'));
        
        manifest = manifest.filter(emp => emp.id !== id);
        localStorage.setItem('manifest', JSON.stringify(manifest));
        
        // Update statistics
        document.getElementById('totalManifest').textContent = manifest.length;
        const vendors = [...new Set(manifest.map(emp => emp.vendor))];
        document.getElementById('totalVendor').textContent = vendors.length;
        
        // Re-render table
        renderManifests(manifest);
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteManifestModal'));
        modal.hide();
        
        // Show success message
        showAlert('Manifest deleted successfully!', 'deleteSuccess');
    }

    document.getElementById('updateManifest').addEventListener('click', updateManifest);
    document.getElementById('confirmDelete').addEventListener('click', confirmDeleteManifest);

     // Reset edit form when modal is closed
     document.getElementById('editManifestModal').addEventListener('hidden.bs.modal', function() {
        const form = document.getElementById('editManifestForm');
        form.reset();
        form.classList.remove('was-validated');
    });
function formatEmail(email) {
    return email.split('@')[0];
}

});
  