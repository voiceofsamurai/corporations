import { preloadImages } from "./utils";
import { gsap } from "gsap";
import { TypeTransition } from "./typeTransition";
import { Item } from "./item";
import gsap from "gsap/gsap-core";

preloadImages(".item__img, .article__img").then(() =>
  document.body.classList.remove("loading")
);

const typeT = new TypeTransition(
  document.querySelector("[data-type-transition]")
);

let isAnimating = false;

const frameEl = document.querySelector(".frame");

let itemsInstanceArr = [];
let currentItem = -1;
const itemsWrap = document.querySelector(".item-wrap");

[...itemsWrap.querySelectorAll(".item")].forEach((itemEl) => {
  const item = new Item(itemEl);
  itemsInstanceArr.push(item);

  item.DOM.el.addEventListener("click", () => openItem(item));
});

const openItem = (item) => {
  if (isAnimating) return;
  isAnimating = true;

  currentItem = itemsInstanceArr.indexOf(item);

  const openTimeline = gsap.timeline({
    onComplete: () => (isAnimating = false),
  });

  openTimeline
    .addLabel("start", 0)
    .addLabel("typeTransition", 0.3)
    .addLabel(
      "articleOpening",
      typeT.in().totalDuration() * 0.75 + openTimeline.labels.typeTransition
    )

    .to(
      itemsInstanceArr.map((item) => item.DOM.el),
      {
        duration: 0.8,
        ease: "power2.inOut",
        opacity: 0,
        y: (pos) => (pos % 2 ? "25%" : "-25%"),
      },
      "start"
    )
    .to(
      frameEl,
      {
        duration: 0.8,
        ease: "power3",
        opacity: 0,
        onComplete: () => gsap.set(frameEl, { pointerEvents: "none" }),
      },
      "start"
    )

    .add(typeT.in().play(), "typeTransition")

    .add(() => {
      gsap.set(backCtrl, { pointerEvents: "auto" });
      gsap.set(itemsWrap, { pointerEvents: "none" });
      itemsInstanceArr[currentItem].DOM.article.classList.add(
        "article--current"
      );
    }, "articleOpening")
    .to(
      backCtrl,
      {
        duration: 0.7,
        opacity: 1,
      },
      "articleOpening"
    )
    .set(
      [
        item.article.DOM.title,
        item.article.DOM.number,
        item.article.DOM.intro,
        item.article.DOM.description,
      ],
      {
        opacity: 0,
        y: "50%",
      },
      "articleOpening"
    )
    .set(item.article.DOM.imageWrap, { y: "100%" }, 2)
    .set(item.article.DOM.image, { y: "-100%" }, 2)
    .to(
      [
        item.article.DOM.title,
        item.article.DOM.number,
        item.article.DOM.intro,
        item.article.DOM.description,
      ],
      {
        duration: 1,
        ease: "expo",
        opacity: 1,
        y: "0%",
        stagger: 0.04,
      },
      "articleOpening"
    )
    .to(
      [item.article.DOM.imageWrap, item.article.DOM.image],
      {
        duration: 1,
        ease: "expo",
        y: "0%",
      },
      "articleOpening"
    );
};

const backCtrl = document.querySelector(".back");

const closeItem = () => {
  if (isAnimating) return;
  isAnimating = true;

  const item = itemsInstanceArr[currentItem];

  const closeTimeline = gsap.timeline({
    onComplete: () => (isAnimating = false),
  });

  closeTimeline
    .addLabel("start", 0)
    .addLabel("typeTransition", 0.5)
    .addLabel(
      "showItems",
      typeT.out().totalDuration() * 0.7 + closeTimeline.labels.typeTransition
    )

    .to(
      backCtrl,
      {
        duration: 0.7,
        ease: "power1",
        opacity: 0,
      },
      "start"
    )
    .to(
      [
        item.article.DOM.title,
        item.article.DOM.number,
        item.article.DOM.intro,
        item.article.DOM.description,
      ],
      {
        duration: 1,
        ease: "power4.in",
        opacity: 0,
        y: "50%",
        stagger: -0.04,
      },
      "start"
    )
    .to(
      item.article.DOM.imageWrap,
      {
        duration: 1,
        ease: "power4.in",
        y: "100%",
      },
      "start"
    )
    .to(
      item.article.DOM.image,
      {
        duration: 1,
        ease: "power4.in",
        y: "-100%",
      },
      "start"
    )

    .add(() => {
      gsap.set(backCtrl, { pointerEvents: "none" });
      gsap.set(itemsWrap, { pointerEvents: "auto" });
      item.DOM.article.classList.remove("article--current");
    })

    .add(typeT.out().play(), "typeTransition")

    .to(
      frameEl,
      {
        duration: 0.8,
        ease: "power3",
        opacity: 1,
        onStart: () => gsap.set(frameEl, { pointerEvents: "auto" }),
      },
      "showItems"
    )
    .to(
      itemsInstanceArr.map((item) => item.DOM.el),
      {
        duration: 1,
        ease: "power3.inOut",
        opacity: 1,
        y: "0%",
      },
      "showItems"
    );
};

backCtrl.addEventListener("click", () => closeItem());
