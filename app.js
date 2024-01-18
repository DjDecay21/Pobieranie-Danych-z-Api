
function makeRequest(method, url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            callback(xhr.status, JSON.parse(xhr.responseText));
        }
    };
    xhr.send(JSON.stringify(data));
}

function getUser() {
    makeRequest('GET', 'https://localhost:7228/api/Users/Users', {}, function (status, response) {
        var userTableBody = document.getElementById('userTable').getElementsByTagName('tbody')[0];
        userTableBody.innerHTML = "";

        var userSelectUpdate = document.getElementById('updateUserId');
        var userSelectDelete = document.getElementById('deleteUserId');
        userSelectUpdate.innerHTML = "";
        userSelectDelete.innerHTML = "";

        if (response.success) {
            users = response.data;

            response.data.forEach(function (user) {
                var row = userTableBody.insertRow();
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);

                cell1.textContent = user.userID;
                cell2.textContent = user.firstName;
                cell3.textContent = user.lastName;
                cell4.textContent = user.email;
                cell5.textContent = user.phone;

                // Wypełnij opcje wyboru dla aktualizacji i usuwania
                var optionUpdate = document.createElement('option');
                optionUpdate.value = user.userID;
                optionUpdate.textContent = user.firstName + ' ' + user.lastName;
                userSelectUpdate.appendChild(optionUpdate);

                var optionDelete = document.createElement('option');
                optionDelete.value = user.userID;
                optionDelete.textContent = user.firstName + ' ' + user.lastName;
                userSelectDelete.appendChild(optionDelete);
            });
        } else {
            console.error('Error in getUser response:', response.message || 'Unknown error');
        }
    });
}
async function addUser(firstName, lastName, password, email, phone) {
    const url = 'https://localhost:7228/api/Users/AddUser';
    if(document.getElementById('addFirstName').value==""){
      var data = {
        "firstName": firstName,
        "lastName": lastName,
        "password": password,
        "email": email,
        "phone": phone
    };

    }else{
      const firstName= document.getElementById('addFirstName').value;
      const lastName = document.getElementById('addLastName').value;
      const password=document.getElementById('addPassword').value;
      const email=document.getElementById('addEmail').value;
      const phone=document.getElementById('addPhone').value;

      var data = {
        "firstName": firstName,
        "lastName": lastName,
        "password": password,
        "email": email,
        "phone": phone
    };

    }

    try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
    
        if (!response.ok) {
          throw new Error('Error adding user');
        }
    
        const result = await response.json();
        console.log('User added successfully:', result);
        getUser();

        return result;
      } catch (error) {
        console.error('Error:', error.message);
        throw error;
      }
}
async function updateUserRequest(userID, firstName, lastName, password, email, phone) {
    const url = 'https://localhost:7228/api/Users/UpdateUser';
  
    const userData = {
      userID: userID,
      firstName: firstName,
      lastName: lastName,
      password: password,
      email: email,
      phone: phone
    };
  
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
  
      if (!response.ok) {
        throw new Error('Error updating user');
      }
  
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
  
  async function updateUser(event) {
    event.preventDefault();
    
    const userIDToUpdate = document.getElementById('updateUserId').value;
    const updatedFirstName = document.getElementById('updateFirstName').value;
    const updatedLastName = document.getElementById('updateLastName').value;
    const updatedPassword = document.getElementById('updatePassword').value;
    const updatedEmail = document.getElementById('updateEmail').value;
    const updatedPhone = document.getElementById('updatePhone').value;
  
    try {
      const result = await updateUserRequest(
        userIDToUpdate,
        updatedFirstName,
        updatedLastName,
        updatedPassword,
        updatedEmail,
        updatedPhone
      );
  
       document.getElementById('updateUserResult').textContent = JSON.stringify(result, null, 2);
    } catch (error) {
       document.getElementById('updateUserResult').textContent = 'Error: ' + error.message;
    }
    getUser();
  }
  

async function deleteUser(event) {
    event.preventDefault();


      const userId = document.getElementById('deleteUserId').value;


  
    const data = {
      userID: parseInt(userId)
    };
  
    try {
      const response = await fetch('https://localhost:7228/api/Users/DeleteUser', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      if (response.ok) {
        const result = await response.json();
  
        document.getElementById('deleteUserResult').innerText = JSON.stringify(result, null, 2);
      } else {
        document.getElementById('deleteUserResult').innerText = 'Błąd usuwania użytkownika.';
      }
    } catch (error) {
      console.error('Wystąpił błąd:', error);
      document.getElementById('deleteUserResult').innerText = 'Wystąpił błąd podczas próby usunięcia użytkownika.';
    }
    getUser();
  }
  async function deleteUserByID(userID) {
    const data = {
      userID: parseInt(userID)
    };
  
    try {
      const response = await fetch('https://localhost:7228/api/Users/DeleteUser', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Użytkownik został pomyślnie usunięty:', result);
      } else {
        console.error('Błąd podczas usuwania użytkownika.');
      }
    } catch (error) {
      console.error('Wystąpił błąd podczas próby usunięcia użytkownika:', error);
    }
  }
  async function test(event) {
    event.preventDefault();

    try {
        let uniqueEmail = `user${Date.now()}@example.com`;
        const addedUser = await addUser("John", "Doe", "test123", uniqueEmail, "123456789");
        const userIDUpdate = addedUser.data.userID;
        const userIDDelete = addedUser.data.userID;

        uniqueEmail = `user_update${Date.now()}@example.com`;

        const updatedUser = await updateUserRequest(userIDUpdate,"Doe","John","321test",uniqueEmail,"987654321");
        console.log("id do usunięcia: "+userIDDelete);

        await deleteUserByID(userIDDelete);

        document.getElementById('testResult').innerText = 'Test przebiegł pomyślnie';
    } catch (error) {
        document.getElementById('testResult').innerText = 'Test przebiegł niepomyślnie: ' + error.message;
    }
}




const testForm = document.querySelector('form[name="testForm"]');
console.log(testForm);




  
getUser();

    

