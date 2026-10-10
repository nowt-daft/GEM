import './utils/object.js';

import is from "./utils/is";

import Properties from "./descriptors/properties.js";
import Accessor from "./descriptors/accessor.js";
import Fields from './descriptors/fields.js';

import Attribute from './descriptors/attribute.js';
import Var from './descriptors/var.js';

import {
	MetaType
} from "./zed.js";


const HTML = 'HTML';

const CONNECT = 'connect';
const DISCONNECT = 'disconnect';
const RENDER = 'render';
const RESIZE = 'resize';

export const EVENTS = {
	CONNECT:	`@${ CONNECT }`,
	DISCONNECT:	`@${ DISCONNECT }`,
	RENDER:		`@${ RENDER }`,
	RESIZE:		`@${ RESIZE }`,
};

// This Needs to be moved to the Colour type...
const HexRegEx = /^#([a-f0-9][a-f0-9][a-f0-9]){1,2}$/i;

const ResizeObserver =
	callback =>
		new ResizeObserver(
			events =>
				events.forEach(
					({ target, contentRect }) =>
						callback(
							target,
							contentRect
						)
				)
		);

const RESIZE_LISTENER =
	ResizeObserver(
		(
			element,
			bounds
		) =>
			element.bounds = bounds
	);

export const event =
	(
		name,
		data = {},
		bubbles = false,
		cancelable = true
	) =>
		Object.assign(
			new Event(
				name,
				{
					bubbles,
					cancelable
				}
			),
			data
		);

const PROPERTIES = {
	styles: Accessor.Get(
		el =>
			getComputedStyle(el)
	),
	bounds: Accessor.Field(
		DOMRect,
		({
			target,
			to: bounds
		}) =>
			target.dispatch(
				RESIZE,
				{ bounds },
				false
			)
	)
};

const PROTOTYPE = {
	attr(
		key = '',
		value = undefined
	) {
		return is.undefined(value) ?
			this.getAttribute(key) :
			this.setAttribute(key, value) ?? value;
	},
	var(
		prop = '',
		value = undefined,
		key = `--${prop}`
	) {
		return is.undefined(value) ?
			this.styles.getPropertyValue(key) :
			this.style.setProperty(key, value) ?? value;
	},

	attach(
		...elements
	) {
		this.append(...elements);
		return this;
	},
	detach(
		...elements
	) {
		elements.forEach(
			el =>
				this.removeChild(el)
		);
		return this;
	},

	listen(
		channel,
		listener,
		captures = false
	) {
		if (channel === RESIZE)
			RESIZE_LISTENER.observe(this);
		
		this.addEventListener(
			channel,
			listener,
			captures
		);

		return this;
	},
	unlisten(
		channel,
		listener,
		captures = false
	) {
		if (channel === RESIZE)
			RESIZE_LISTENER.unobserve(this);

		this.removeEventListener(
			channel,
			listener,
			captures
		);

		return this;
	},
	dispatch(
		channel,
		data = {},
		bubbles = false,
		cancelable = true
	) {
		this.dispatchEvent(
			event(
				channel,
				{
					target: this,
					data
				},
				bubbles,
				cancelable
			)
		);
		return this;
	},
};


Object.defineProperties(
	HTMLElement.prototype,
	Object.concat(
		new Fields(
			PROPERTIES
		).init(),
		Properties.static(
			PROTOTYPE
		)
	)
);

export const Component =
	MetaType(
		'Component',
		(
			tag,
			{
				parents,
				prescriptor,
				properties,
				defaults,
				listeners
			}
		) => {
			const BaseClass =
				parents[0].name?.startsWith(HTML) ?
					parents.shift() :
					HTMLElement;
			
			const Constructor = {
				[tag](
					attributes = {},
					dataset = {}
				) {

					const element =
						document.createElement(tag);

					Object.assign(
						Object.assign(
							element,
							attributes
						).dataset,
						dataset
					);
					return element;
				}
			}[tag];

			class Component extends BaseClass {
				#connected = false;

				static defines(instance) {
					return Constructor.defines(instance);
				}

				constructor() {
					super();
					
					// why not Object.init?
					Object.inherit(
						Object.assign(
							Object.defineProperties(
								this,
								properties ?? {}
							),
							defaults ?? {}
						)
					);
				}

				connectedCallback() {
					this.#connected = true;
					this.bounds = this.getBoundingClientRect();

					Object.validate(this);

					listeners.forEach(
						([key, listeners]) =>
							listeners.forEach(
								listener =>
									this.listen(
										key,
										listener
									)
							)
					);

					this.dispatch(CONNECT);
					this.renderCallback();
				}

				disconnectedCallback() {
					this.#connected = false;

					this.dispatch(DISCONNECT);

					listeners.forEach(
						([key, listeners]) =>
							listeners.forEach(
								listener =>
									this.unlisten(
										key,
										listener
									)
							)
					);
				}

				renderCallback(ts = 0) {
					if (!this.#connected)
						return;

					Object.forEach(
						prescriptor,
						(
							key,
							field
						) => {
							this[key] =
								field instanceof Var ?
									this.var(key) :
									field instanceof Attribute ?
										this.attr(key) :
										this[key];
						}
					);
					
					this.dispatch(
						RENDER,
						{ ts }
					);

					requestAnimationFrame(
						ts =>
							this.renderCallback(ts)
					);
				}
			}

			customElements.define(
				tag,
				Component,
				BaseClass === HTMLElement ?
					undefined :
					{
						extends: BaseClass
					}
			);

			return Constructor;
		}
	);
