import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g recipe)
   * @param {boolean} [render=true] If false, creates a markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @todo Finish implementation
   */
  render(data, render = true) {
    // the array.isarray(data) checks whether data is an array or not (we could've passed object so we have to check)
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();

    this._data = data;
    // create an HTML markup of our info from model.js from state to show to user
    const markup = this._generateMarkup();

    if (!render) return markup;

    // clear up spinner that is in our html element
    this._clear();

    // show it to them!
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    // the array.isarray(data) checks whether data is an array or not (we could've passed object so we have to check)
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();

    this._data = data;
    // Here we will create a new Markup, but not render it! (We wont add it to parent element HTML).
    const newMarkup = this._generateMarkup();
    // we will compare the new markup with the old and only render changed attributes between the two.

    // but comparing strings is hard, and newmarkup is a string atm. So we first will convert it to a dom object.
    // this dom is stored in our memory, not shown on the page
    const newDom = document.createRange().createContextualFragment(newMarkup);
    // selecting all the elements of newDom
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    // loop over both arrays and compare the two.
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // isEqualNode is a handy method to compare the two.
      //   console.log(newEl.isEqualNode(curEl));

      //if new element is different from cur element change curent's text content
      // updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      //updates changed ATTRIBUTES (like data-update-to so we can further increase or decrease portions as we use those data attributes to know on which portion we are atm)
      //if new element doesn't equal current element
      if (!newEl.isEqualNode(curEl)) {
        // take the object with the new attributes of an element and convert it to an array
        // then loop over that array and set the attributes name and value onto the current element
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    // clear the HTML markup that was there before (most likely some other recipe)
    this._clear();

    // create a markup for our spinner
    const markup = `
      <div class="spinner">
          <svg>
              <use href="${icons}#icon-loader"></use>
          </svg>
      </div>
      `;

    // show our spinner!
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    this._clear();

    const markup = `
        <div class="error">
            <div>
                <svg>
                <use href="${icons}#icon-alert-triangle"></use>
                </svg>
            </div>

            <p>${message}</p>
        </div>`;

    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    this._clear();

    const markup = `
        <div class="message">
            <div>
                <svg>
                <use href="${icons}#icon-smile"></use>
                </svg>
            </div>

            <p>${message}</p>
        </div>`;

    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
