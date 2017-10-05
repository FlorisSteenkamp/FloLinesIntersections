'use strict'


/**
 * Representation of a linked list node.
 *
 * @ignore
 * @constructor
 * @param {LinkedList} list - The linked list this node belongs to.
 * @param {*} item - The actual data stored at a node.
 * @param {ListNode} prev - The previous item or undefined if there is 
 * none.
 * @param {ListNode} next - The next item or undefined if there is none.
 */
function ListNode(list, item, prev, next) {
	this.list = list;
	this.item = item;
	this.prev = prev;	
	this.next = next;
}
	

/**
 * Represents a two-way linked list.
 * @ignore 
 * @constructor 
 */
function LinkedList(items) {
	this.head = undefined;
	this.tail = undefined;
	
	if (!items || !items.length) { return; }
	
	addAllFromScratch(this, items);
}


LinkedList.isEmpty = function(list) {
	return !list.head;
}


/**
 * Insert an item.
 * 
 * @ignore
 * @param item {*} - Item to insert.
 * @param prev_ - Insert new item right after this item or if undefined
 * insert it in the front.
 */
LinkedList.insert = function(list, item, prev_) {

	let node = new ListNode(
			list, item, undefined, undefined 
	);
	
	
	if (!list.head) {
		// List is empty
		list.head = node;
		list.tail = node;
		return node;
	} 

	
	let prev;
	let next;
	if (!prev_) {
		next = list.head;
		list.head = node;
	} else {
		prev = prev_;
		next = prev_.next;
	}

	if (next) { 
		next.prev = node; 
	} else {
		list.tail = node;
	}
	if (prev) { prev.next = node; }
	node.prev = prev;
	node.next = next;
		
	return node;
}


LinkedList.insertInFront = function(list, item) {
	LinkedList.insert(list, item, undefined);
}


LinkedList.insertAtBack = function(list, item) {
	let tail = list.tail;
	
	let node = new ListNode(
			list, item, tail, undefined 
	);
	
	if (!tail) {
		list.head = node;
		list.tail = node;
		return;
	}
	
	tail.next = node;
	list.tail = node;
}


LinkedList.removeFromFront = function(list, item) {
	// TODO - finish
}


LinkedList.removeFromBack = function(list) {
	let tail = list.tail;
	if (!tail) { return; }
	
	let prev = tail.prev; 
	if (!prev) {
		// List is now empty.
		list.head = undefined;
		list.tail = undefined;
		
		return;
	} 
		
	prev.next = undefined;
	list.tail = prev;
}


LinkedList.remove = function(list, item) {
	let node = LinkedList.find(list, item);
	
	if (!node) { return; }
	
	LinkedList.removeNode(list, node)
}


LinkedList.removeNode = function(list, node) {
	let prev = node.prev;
	let next = node.next;

	if (prev) {
		if (next) {
			prev.next = next;
			next.prev = prev;
			return;
		}
		prev.next = undefined;
		list.tail = prev;
		return;
	}
	
	if (next) {
		next.prev = undefined;
		list.head = next;
		return;
	}
	
	// Delete the only item.
	list.head = undefined;
	list.tail = undefined;
}


/**
 * Find a node in the list by === on node.item.
 * @ignore
 * @returns The found node.
 */
LinkedList.find = function(list, item) {
	let head = list.head;
	
	if (!head) { return undefined; }
	
	let node = head;
	while (node) {
		if (node.item === item) {
			return node;
		}
		node = node.next;
	}
	
	return undefined;
}


LinkedList.getAsArray = function(list) {
	let nodes = [];
	
	let node = list.head;
	do {
		nodes.push(node.item);
		
		node = node.next;
	} while (node);
	
	return nodes;
}


LinkedList.forEach = function(list, f) {
	let node = list.head;
	do {
		f(node);
		
		node = node.next;
	} while (node);
}


LinkedList.addAllFromScratch = function(list, items) {

	let prevNode;
	for (let i=0; i<items.length; i++) {
		
		let node = new ListNode(
			list,
			items[i],
			prevNode,
			undefined
		);
		
		if (prevNode) { prevNode.next = node; }
		prevNode = node; 
		
		if (i === 0) { list.head = node; }
	}
}
	

module.exports = LinkedList;
