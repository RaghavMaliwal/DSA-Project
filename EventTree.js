// EventTree.js

class EventNode {
    constructor(name, startTime, endTime, venue, desc) {
      this.name = name;
      this.startTime = startTime;
      this.endTime = endTime;
      this.venue = venue;
      this.desc = desc;
      this.left = null;
      this.right = null;
    }
  }
  
  class EventTree {
    constructor() {
      this.root = null;
    }
  
    compareTimes(time1, time2) {
      return new Date(`1970-01-01T${time1}:00`) - new Date(`1970-01-01T${time2}:00`);
    }
  
    insert(name, startTime, endTime, venue, desc) {
      const newNode = new EventNode(name, startTime, endTime, venue, desc);
      if (this.root === null) {
        this.root = newNode;
      } else {
        this._insertNode(this.root, newNode);
      }
    }
  
    _insertNode(current, newNode) {
      if (this.compareTimes(newNode.startTime, current.startTime) < 0) {
        if (current.left === null) {
          current.left = newNode;
        } else {
          this._insertNode(current.left, newNode);
        }
      } else {
        if (current.right === null) {
          current.right = newNode;
        } else {
          this._insertNode(current.right, newNode);
        }
      }
    }
  
    delete(startTime) {
      this.root = this._deleteNode(this.root, startTime);
    }
  
    _deleteNode(node, startTime) {
      if (node === null) return null;
  
      if (this.compareTimes(startTime, node.startTime) < 0) {
        node.left = this._deleteNode(node.left, startTime);
      } else if (this.compareTimes(startTime, node.startTime) > 0) {
        node.right = this._deleteNode(node.right, startTime);
      } else {
        if (node.left === null && node.right === null) return null;
        else if (node.left === null) return node.right;
        else if (node.right === null) return node.left;
        const minNode = this._findMin(node.right);
        node.name = minNode.name;
        node.startTime = minNode.startTime;
        node.endTime = minNode.endTime;
        node.venue = minNode.venue;
        node.desc = minNode.desc;
        node.right = this._deleteNode(node.right, minNode.startTime);
      }
      return node;
    }
  
    _findMin(node) {
      while (node.left !== null) node = node.left;
      return node;
    }
  
    search(startTime) {
      return this._searchNode(this.root, startTime);
    }
  
    _searchNode(node, startTime) {
      if (node === null) return null;
      if (this.compareTimes(startTime, node.startTime) === 0) return node;
      if (this.compareTimes(startTime, node.startTime) < 0) return this._searchNode(node.left, startTime);
      return this._searchNode(node.right, startTime);
    }
  
    modify(startTime, newName, newEndTime, newVenue, newDesc) {
      const node = this.search(startTime);
      if (node) {
        node.name = newName;
        node.endTime = newEndTime;
        node.venue = newVenue;
        node.desc = newDesc;
      }
    }
  
    inOrderTraversal(callback) {
      this._inOrderTraversal(this.root, callback);
    }
  
    _inOrderTraversal(node, callback) {
      if (node !== null) {
        this._inOrderTraversal(node.left, callback);
        callback(node);
        this._inOrderTraversal(node.right, callback);
      }
    }
  }
  
  export { EventTree, EventNode };
  