import gsap from 'gsap/gsap-core';
import { Article } from './article';

export class Item {
  DOM = {
    el: null,
    image: null,
    title: null,
    description: null,
    article: null
  };
  article;

  constructor(DOM_el) {
    this.DOM.el = DOM_el;

    this.DOM.image = this.DOM.el.querySelector('.item__img');
    this.DOM.title = this.DOM.el.querySelector('.item__caption-title');
    this.DOM.description = this.DOM.el.querySelector('.item__caption-description');

    this.DOM.article = document.getElementById(this.DOM.el.dataset.article);

    this.article = new Article(this.DOM.article);

    const hoverTimelineDefaults = { duration: 1, ease: 'expo' };
    this.DOM.el.addEventListener('mouseenter', () => {
      gsap.timeline({ defaults: hoverTimelineDefaults })
        .to([this.DOM.image, this.DOM.title, this.DOM.description], {
          y: pos => pos * 8 - 4
        })
    });
    this.DOM.el.addEventListener('mouseleave', () => {
      gsap.timeline({ defaults: hoverTimelineDefaults })
        .to([this.DOM.image, this.DOM.title, this.DOM.description], {
          y: 0
        });
    });
  }
}