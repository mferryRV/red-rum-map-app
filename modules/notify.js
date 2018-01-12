const element = document.querySelector('.notification');
let timeout = null;

const toggleState = () => {
	element.classList.toggle('is-visible');
	element.innerText = null;
};

element.addEventListener('click', function() {
	element.classList.toggle('is-visible');
})

document.addEventListener('notify', function(event) {
	element.classList.add('is-visible');

	element.innerText = event.detail;

	clearTimeout(timeout);
	timeout = setTimeout(function() {
		element.classList.remove('is-visible');
	}, 3000)
});

export default function(message) {
	document.dispatchEvent(new CustomEvent('notify', {
		detail: message
	}));
}