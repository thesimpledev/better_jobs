(function() {
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

    function setInitialFill() {
      const points = rangeInput.value;
      sliderLabelDetail.textContent = _pluralizePoints(points);
      sliderFill.style.width = `${points}%`;
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

    document.addEventListener('DOMContentLoaded', setInitialFill);
  }

  function saveAndReloadSearch() {
    const form = document.querySelector('form.search');
    const pointsToPass = document.querySelector('#passing_points');
    const goodKeywords = document.querySelector('#good-keywords');
    const badKeywords = document.querySelector('#bad-keywords');
    const positionExclusions = document.querySelector('#position-exclusions');

    form.addEventListener('submit', function() {
      localStorage.setItem('pointsToPass', pointsToPass.value);
      localStorage.setItem('goodKeywords', goodKeywords.value);
      localStorage.setItem('badKeywords', badKeywords.value);
      localStorage.setItem('positionExclusions', positionExclusions.value);
    });

    document.addEventListener('DOMContentLoaded', function() {
      const storedPointsToPass = localStorage.getItem('pointsToPass');
      const storedGoodKeywords = localStorage.getItem('goodKeywords');
      const storedBadKeywords = localStorage.getItem('badKeywords');
      const storedPositionExclusions = localStorage.getItem('positionExclusions');

      [
        {
          storage: storedPointsToPass,
          field: pointsToPass
        },
        {
          storage: storedGoodKeywords,
          field: goodKeywords
        },
        {
          storage: storedBadKeywords,
          field: badKeywords
        },
        {
          storage: storedPositionExclusions,
          field: positionExclusions
        },
      ].forEach(function(element) {
        if (element.storage) {
          element.field.value = element.storage;
        }
      });
    });
  }

  function resetSearch() {
    const resetButton = document.querySelector('button.reset');

    resetButton.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.clear();
      window.location.reload();
    });
  }

  saveAndReloadSearch();
  disableSubmitAfterClicking();
  pointsSlider();
  resetSearch();
})();