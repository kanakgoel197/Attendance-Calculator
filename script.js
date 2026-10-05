document.addEventListener("DOMContentLoaded", () => {
  const totalInput = document.getElementById("total");
  const attendedInput = document.getElementById("attended");
  const targetInput = document.getElementById("target");
  const targetValue = document.querySelector(".target span");
  const button = document.getElementById("calculate");

  const percentage = document.getElementById("percentage");
  const fill = document.getElementById("progressFill");
  const marker = document.getElementById("targetMarker");
  const targetLabel = document.getElementById("targetLabel");

  const answer = document.querySelector(".answer");
  const headline = document.querySelector(".answer h2");
  const details = document.getElementById("answer-final");

  const plural = (n) => (n === 1 ? "class" : "classes");

  // Keep the slider label, marker and target text in sync
  function updateTarget() {
    const target = Number(targetInput.value);
    targetValue.textContent = target + "%";
    targetLabel.textContent = "Target: " + target + "%";
    marker.style.left = target + "%";
  }

  function showResult(state, title, text) {
    answer.classList.remove("good", "bad");
    if (state) answer.classList.add(state);
    headline.textContent = title;
    details.textContent = text;
  }

  function calculate() {
    const total = Number(totalInput.value);
    const attended = Number(attendedInput.value);
    const target = Number(targetInput.value);

    if (!totalInput.value || !attendedInput.value || total <= 0 || attended < 0) {
      showResult("", "Enter your numbers.", "Fill in both session counts first.");
      return;
    }
    if (attended > total) {
      showResult("bad", "Check your numbers.", "Attended sessions can't be more than the total.");
      return;
    }

    // Current attendance
    const current = (attended / total) * 100;
    percentage.innerHTML = Math.round(current * 10) / 10 + "<small>%</small>";
    fill.style.width = Math.min(current, 100) + "%";

    if (attended * 100 >= target * total) {
      // At or above target: how many can be skipped?
      const canSkip = Math.floor((attended * 100) / target - total);
      if (canSkip === 0) {
        showResult("good", "Don't skip any.", "You're right at your " + target + "% target.");
      } else {
        showResult(
          "good",
          "You can skip " + canSkip + " " + plural(canSkip) + ".",
          "You'll still be at or above " + target + "%."
        );
      }
    } else if (target === 100) {
      showResult("bad", "100% is out of reach.", "You've already missed a session.");
    } else {
      // Below target: how many in a row must be attended?
      const needed = Math.ceil((target * total - 100 * attended) / (100 - target));
      showResult(
        "bad",
        "Don't skip any.",
        "Attend the next " + needed + " " + plural(needed) + " in a row to reach " + target + "%."
      );
    }
  }

  targetInput.addEventListener("input", updateTarget);
  button.addEventListener("click", calculate);
  updateTarget();
});