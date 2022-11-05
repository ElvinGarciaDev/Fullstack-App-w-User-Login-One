var thumbUp = document.getElementsByClassName("bi-check-circle"); // Select the check icon
var trash = document.getElementsByClassName("bi-trash"); // Select the Trash Icon.

Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        let name = this.parentNode.parentNode.childNodes[1].innerText

        // We get back (name: Aemond) We only want Aemond so we need to remove name:
        let strArr = name.split("")
        strArr.splice(0,6)
        name = strArr.join("")
        console.log(name)

        fetch('updateComplete', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'Name': name,
            'true': "true"
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        let name = this.parentNode.parentNode.childNodes[1].innerText

        // We get back (name: Aemond) We only want Aemond so we need to remove name:
        let strArr = name.split("")
        strArr.splice(0,6)
        name = strArr.join("")
        console.log(name)
        fetch('deleteOrder', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'Name': name
          })
        }).then(function (response) {
          if (response.ok) return response.json()


          // window.location.reload()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
          })
      });
});
