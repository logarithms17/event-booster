// (() => {
//   const refs = {
//     openModalBtn: document.querySelector("[data-modal-open]"),
//     closeModalBtn: document.querySelector("[data-modal-close]"),
//     submitBtn: document.querySelector("[data-modal-submit]"),
//     modal: document.querySelector("[data-modal]"),
//   };

//   refs.openModalBtn.addEventListener("click", toggleModal);
//   refs.closeModalBtn.addEventListener("click", toggleModal);
//   refs.submitBtn.addEventListener("click", hideModal);

//   function toggleModal() {
//     refs.modal.classList.toggle("is-hidden");
//   }

//   function hideModal() {
//     refs.modal.classList.add("is-hidden");
//   }
// })();