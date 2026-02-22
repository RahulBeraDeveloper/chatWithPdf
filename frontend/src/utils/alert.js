import Swal from 'sweetalert2'

export const showError = (message = 'Something went wrong!') => {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message,
    confirmButtonColor: '#d33',
  })
}

export const showSuccess = (message = 'Success!') => {
  Swal.fire({
    icon: 'success',
    title: 'Success',
    text: message,
    confirmButtonColor: '#4F1C51',
  })
}