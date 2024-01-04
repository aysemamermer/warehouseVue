
## Vue Project README

# Project Overview

This Vue project is designed to manage equipment and machine information. It includes features such as adding, editing, and deleting equipment and machine records. The project uses Vue.js for the front end and communicates with a backend API to handle data storage and retrieval.

#Project Structure
The project consists of the following main components:

#Equipment Management

`src/components/EquipmentManagement.vue`: Manages the CRUD operations for equipment records.
`src/components/CommonForm.vue`: A reusable form component for adding and editing equipment details.
Machine Management

`src/components/MachineManagement.vue`: Handles the CRUD operations for machine records.
`src/components/CommonForm.vue`: Reused form component for adding and editing machine details.
`src/components/MachineDetailsModal.vue`: Displays detailed information about a specific machine, including connected equipment.

#Getting Started

Follow the steps below to set up and run the Vue project:

## Prerequisites
Make sure you have the following installed:

# Installation

'''
git clone https://github.com/aysemamermer/warehouseVue
'''

'''
cd new-app
'''

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```


## Usage

# Equipment Management

- **Adding Equipment:**
  - Click on the "Add Equipment" button.
  - Fill in the required information in the form.
  - Click "Add Equipment" to submit the form.
 
- **Editing Equipment:**
  - Click the "Edit" button next to the equipment you want to edit.
Modify the information in the form.
  - Modify the information in the form.
  - Click "Save Changes" to update the equipment.
 
- **Deleting Equipment:**
  - Click the "Delete" button next to the equipment you want to delete.
  - Confirm the deletion when prompted.
    

# Equipment Management

- **Adding Machine:**
  - Click on the "Add Machine" button.
  - Provide the necessary details in the form.
  - Click "Add Machine" to save the new machine.
 
- **Editing Machine:**
  - Click the "Edit" button next to the machine you want to modify.
Modify the information in the form.
  - Update the information in the form.
  - Click "Save Changes" to apply the changes.
 
- **Deleting Machine:**
  - Click the "Delete" button next to the machine you want to remove.
  - Confirm the deletion when prompted.
    

# Additional Notes:

- The project communicates with a backend API, so ensure the API is running and properly configured.
- For more information on API endpoints, refer to the API documentation: ( https://github.com/aysemamermer/warehouseDjango/ ) 



