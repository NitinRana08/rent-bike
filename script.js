function bookBike(bikeName){
    localSorage.setItem('selectedBike',bikeName) //store in locally

    window.location.href = "booking.html" // lets go to booking page bb
}

function validdatePhone(){
    const phone = document.getElementById('phone').value
    if(phone.length !== 10){
        document.getElementById('error').style.display = 'block'
        return false; //cant submit bb

    }else
    return true
}