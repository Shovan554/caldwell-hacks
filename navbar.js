// navbar.js
import { smoothTransitionToTarget } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
  const navBarContainer = document.createElement('div');
  navBarContainer.className = 'nav-bar-container';

  const navBarOptions = ['Home', 'About', 'Themes', 'Itinerary', 'Meet the Team', 'FAQ'];
  const navBarOptionsHTML = navBarOptions
    .map((option, index) => `<li data-index="${index}">${option}</li>`)
    .join('');

  navBarContainer.innerHTML = `
    <div class="nav-bar-rect-container">
      <ul class="nav-bar-options">
        ${navBarOptionsHTML}
      </ul>
    </div>
  `;

  document.body.appendChild(navBarContainer);

  document.querySelectorAll('.nav-bar-options li').forEach((item) => {
    item.addEventListener('click', (event) => {
      const targetIndex = parseInt(event.target.getAttribute('data-index'), 10);
      smoothTransitionToTarget(targetIndex);
    });
  });
});
