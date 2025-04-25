document.addEventListener("DOMContentLoaded", () => {
  const stars = document.querySelectorAll(".star");
  let selectedRating = 0;

  // Star hover & click
  stars.forEach((star) => {
    star.addEventListener("mouseover", () => {
      highlightStars(+star.dataset.stars); // Highlight the stars on hover
      star.classList.add("hovered"); // Add hovered class on hover
    });

    star.addEventListener("mouseout", () => {
      highlightStars(selectedRating); // Reset to selected rating on mouse out
      star.classList.remove("hovered"); // Remove hovered class
    });

    star.addEventListener("click", () => {
      selectedRating = +star.dataset.stars;
      document.getElementById("review-rating").value = selectedRating;
      highlightStars(selectedRating); // Highlight the selected stars on click
      stars.forEach(s => s.classList.remove("hovered")); // Remove hovered class when clicked
    });
  });

  function highlightStars(rating) {
    stars.forEach((star) => {
      star.classList.remove("selected", "default");

      if (+star.dataset.stars <= rating) {
        star.classList.add("selected"); // Apply gold color to selected stars
      } else {
        star.classList.add("default"); // Apply transparent color to non-selected stars
      }
    });
  }

  loadReviews();
});

function submitReview() {
  const rating = +document.getElementById("review-rating").value;
  const text = document.getElementById("review").value.trim();

  if (!rating) {
    alert("Please select a rating before submitting.");
    return;
  }

  fetch("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rating, text }),
  })
    .then((res) => res.json())
    .then(() => {
      document.getElementById("review").value = "";
      document.getElementById("review-rating").value = "";
      document.querySelectorAll(".star").forEach((s) => {
        s.classList.remove("selected", "hovered"); // Reset all stars
      });

      const msg = document.getElementById("review-message");
      msg.style.display = "block";
      setTimeout(() => (msg.style.display = "none"), 3000);

      loadReviews();
    })
    .catch(console.error);
}

function loadReviews() {
  const reviewList = document.getElementById("review-list");
  // Remove old items (keep the heading)
  while (reviewList.children.length > 1) {
    reviewList.removeChild(reviewList.lastChild);
  }

  fetch("/api/reviews")
    .then((res) => res.json())
    .then((reviews) => {
      if (!reviews.length) {
        const no = document.createElement("p");
        no.textContent = "No reviews yet. Be the first!";
        return reviewList.appendChild(no);
      }

      reviews.forEach((r) => {
        const div = document.createElement("div");
        div.className = "review-item";

        let starsHtml = "";
        for (let i = 1; i <= 5; i++) {
          starsHtml += i <= r.rating ? "★" : "☆";
        }

        const date = new Date(r.date).toLocaleString();
        div.innerHTML = `
          <div class="review-rating">${starsHtml}</div>
          ${r.text ? `<div class="review-text">${r.text}</div>` : ""}
          <div class="review-date">${date}</div>
          <hr>
        `;
        reviewList.appendChild(div);
      });
    })
    .catch(console.error);
}
