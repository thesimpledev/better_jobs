(function() {
  function _setLocation(location) {
    const selectedLocation = document.querySelector('.selected-location');
    const locationForms = document.querySelectorAll('.location');
    const jumbo = document.querySelector('.search-jumbo');
    const locationToBackground = {
      'San Francisco, CA': 'sanfrancisco.jpg',
      'New York, NY': 'newyork.jpg',
      'Boston, MA': 'boston.jpg',
      'Austin, TX': 'austin.jpg',
      'Seattle, WA': 'seattle.jpg',
      'Denver, CO': 'denver.jpg',
      'Remote': 'remote.jpg',
    };

    locationForms.forEach(form => form.value = location);
    selectedLocation.textContent = location;
    jumbo.style.backgroundImage = `url('assets/${locationToBackground[location]}')`;
  }

  function locationSelect() {
    const locationElements = document.querySelectorAll('.location-selection');

    locationElements.forEach(element => {
      element.addEventListener('click', function(e) {
        const location = e.currentTarget.lastElementChild.textContent;
        _setLocation(location);
        changePageTitle(location)
      });
    });
  }

  function changePageTitle(location) {
    document.title = `Better Jobs - For Software Engineers in ${location}`
  }

  // disable button after submitting and append '.'s while waiting for search
  function disableSubmitAfterClicking() {
    const form = document.querySelector('form.search');
    const submitButton = document.querySelector('button.submit');

    form.addEventListener('submit', function() {
      submitButton.classList.add('disabled');
      submitButton.textContent = 'Searching, one moment...';

      // append '.'s while waiting on search
      setInterval(function() {
        submitButton.textContent += '.';
      }, 500);
    });
  }

  // points slider
  function pointsSlider() {
    const slider = document.querySelector('.slider');
    const sliderFill = document.querySelector('.slider-fill');
    const sliderLabelDetail = document.querySelector('.slider-label-detail');
    const rangeInput = document.querySelector('#passing_points');
    let mouseHeld = false;

    function updateInputValue(points) {
      rangeInput.value = points;
    }

    function startSlide() {
      mouseHeld = true;
    }

    function endSlide() {
      mouseHeld = false;
    }

    function sliderSlide(e) {
      const sliderBoundingRect = slider.getBoundingClientRect();

      if (mouseHeld) {
        let points = parseInt(e.offsetX / sliderBoundingRect.width * 100);
        if (points < 0) {
          points = 0;
        } else if (points > 100) {
          points = 100;
        }

        sliderLabelDetail.textContent = `${points} point${points === 1 ? '' : 's'}`;
        sliderFill.style.width = `${e.offsetX}px`;
        updateInputValue(points);
      }
    }

    function sliderSlideMobile(e) {
      const sliderBoundingRect = slider.getBoundingClientRect();
      e.preventDefault();

      if (mouseHeld) {
        let points = parseInt(e.touches[0].clientX / sliderBoundingRect.width * 100);
        if (points < 0) {
          points = 0;
        } else if (points > 100) {
          points = 100;
        }

        sliderLabelDetail.textContent = _pluralizePoints(points);
        sliderFill.style.width = `${e.touches[0].clientX}px`;
        updateInputValue(points);
      }
    }

    function _pluralizePoints(points) {
      return `${points} point${points === 1 ? '' : 's'}`;
    }

    slider.addEventListener('mousedown', startSlide);
    slider.addEventListener('touchstart', startSlide);

    slider.addEventListener('mousemove', sliderSlide);
    slider.addEventListener('touchmove', sliderSlideMobile);

    slider.addEventListener('mouseup', endSlide);
    slider.addEventListener('touchend', endSlide);

    slider.addEventListener('mouseleave', endSlide);
    slider.addEventListener('touchleave', endSlide);
  }

  function clearQueryString() {
    window.history.pushState({}, document.title, '/');
  }

  const goodKeywordStorage = [];
  function handleGoodKeywords() {
    const formAddedKeywords = document.querySelector('.form-added-keywords');
    const formAddButton = document.querySelector('.form-add-button');
    const keywordInput = document.querySelector('.form-add-keyword');
    const pointsInput = document.querySelector('.form-add-points');

    [keywordInput, pointsInput].forEach(node => {
      node.addEventListener('keydown', function(e) {
        if (e.code === "Enter") {
          e.preventDefault();
          goodKeywordStorage.push([keywordInput.value, parseInt(pointsInput.value)]);
          render();
          clearInputs();
        }
      });
    });

    formAddButton.addEventListener('click', function(e) {
      if (e.target.textContent !== 'Add') {
        e.preventDefault();
        clearInputs();
      }
    });

    formAddedKeywords.addEventListener('click', function(e) {
      if (e.target && e.target.nodeName === 'BUTTON') {
        e.preventDefault();
        delete goodKeywordStorage[e.target.dataset.index];
        render();
      }
    });

    function render() {
      formAddedKeywords.innerHTML = '';

      goodKeywordStorage.forEach(function(entry, i) {
        const container = document.createElement('li');
        container.classList.add('form-added-keyword');

        const keywordContainer = document.createElement('p');
        keywordContainer.textContent = entry[0];

        const pointsContainer = document.createElement('p');
        pointsContainer.textContent = `${entry[1]} points`;
        const button = document.createElement('button');
        button.dataset.index = i;
        button.textContent = 'X';
        pointsContainer.appendChild(button);

        container.appendChild(keywordContainer);
        container.appendChild(pointsContainer);

        formAddedKeywords.appendChild(container);
      });
    }

    function clearInputs() {
      keywordInput.value = '';
      pointsInput.value = '';
      keywordInput.focus();
    }
  }

  locationSelect();
  disableSubmitAfterClicking();
  pointsSlider();
  clearQueryString();
  handleGoodKeywords();
})();