class Node {
  constructor(value, color) {
    this.value = value;
    this.color = color; // RED or BLACK
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

class RedBlackTree {
  constructor() {
    this.TNULL = new Node(null, "BLACK"); // Sentinel node for leaves
    this.root = this.TNULL;
  }

  // Rotate left at node x
  leftRotate(x) {
    let y = x.right;
    x.right = y.left;
    if (y.left !== this.TNULL) {
      y.left.parent = x;
    }
    y.parent = x.parent;
    if (x.parent === null) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }
    y.left = x;
    x.parent = y;
  }

  // Rotate right at node x
  rightRotate(x) {
    let y = x.left;
    x.left = y.right;
    if (y.right !== this.TNULL) {
      y.right.parent = x;
    }
    y.parent = x.parent;
    if (x.parent === null) {
      this.root = y;
    } else if (x === x.parent.right) {
      x.parent.right = y;
    } else {
      x.parent.left = y;
    }
    y.right = x;
    x.parent = y;
  }

  // Balance the tree after insertion
  balanceInsert(node) {
    let current = node;
    while (current.parent && current.parent.color === "RED") {
      if (current.parent === current.parent.parent.left) {
        let uncle = current.parent.parent.right;
        if (uncle && uncle.color === "RED") {
          // Case 1: uncle is red (recolor)
          current.parent.color = "BLACK";
          uncle.color = "BLACK";
          current.parent.parent.color = "RED";
          current = current.parent.parent;
        } else {
          // Case 2 or 3: uncle is black (rotate)
          if (current === current.parent.right) {
            current = current.parent;
            this.leftRotate(current); // Left rotation
          }
          current.parent.color = "BLACK";
          current.parent.parent.color = "RED";
          this.rightRotate(current.parent.parent); // Right rotation
        }
      } else {
        let uncle = current.parent.parent.left;
        if (uncle && uncle.color === "RED") {
          // Mirror Case 1: uncle is red
          current.parent.color = "BLACK";
          uncle.color = "BLACK";
          current.parent.parent.color = "RED";
          current = current.parent.parent;
        } else {
          // Mirror Case 2 or 3: uncle is black
          if (current === current.parent.left) {
            current = current.parent;
            this.rightRotate(current); // Right rotation
          }
          current.parent.color = "BLACK";
          current.parent.parent.color = "RED";
          this.leftRotate(current.parent.parent); // Left rotation
        }
      }
    }
    this.root.color = "BLACK"; // The root must always be black
  }

  // Insert a node
  insert(value) {
    let newNode = new Node(value, "RED"); // New nodes are red by default
    newNode.left = this.TNULL;
    newNode.right = this.TNULL;

    let parent = null;
    let current = this.root;

    while (current !== this.TNULL) {
      parent = current;
      if (newNode.value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    newNode.parent = parent;
    if (parent === null) {
      this.root = newNode; // The tree was empty
    } else if (newNode.value < parent.value) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }

    this.balanceInsert(newNode); // Balance the tree
  }

  deleteNode(data) {
    this.deleteNodeHelper(this.root, data);
  }

  deleteNodeHelper(node, key) {
    let z = this.TNULL;
    let x, y;

    while (node !== this.TNULL) {
      if (node.value === key) {
        z = node;
      }

      if (node.value <= key) {
        node = node.right;
      } else {
        node = node.left;
      }
    }

    if (z === this.TNULL) {
      console.log("Node not found in the tree");
      return;
    }

    y = z;
    let yOriginalColor = y.color;
    if (z.left === this.TNULL) {
      x = z.right;
      this.transplant(z, z.right);
    } else if (z.right === this.TNULL) {
      x = z.left;
      this.transplant(z, z.left);
    } else {
      y = this.minimum(z.right);
      yOriginalColor = y.color;
      x = y.right;
      if (y.parent === z) {
        x.parent = y;
      } else {
        this.transplant(y, y.right);
        y.right = z.right;
        y.right.parent = y;
      }

      this.transplant(z, y);
      y.left = z.left;
      y.left.parent = y;
      y.color = z.color;
    }

    if (yOriginalColor === "BLACK") {
      this.fixDelete(x);
    }
  }

  transplant(u, v) {
    if (u.parent === null) {
      this.root = v;
    } else if (u === u.parent.left) {
      u.parent.left = v;
    } else {
      u.parent.right = v;
    }
    v.parent = u.parent;
  }

  minimum(node) {
    while (node.left !== this.TNULL) {
      node = node.left;
    }
    return node;
  }

  fixDelete(x) {
    while (x !== this.root && x.color === "BLACK") {
      if (x === x.parent.left) {
        let w = x.parent.right;
        if (w.color === "RED") {
          w.color = "BLACK";
          x.parent.color = "RED";
          this.leftRotate(x.parent);
          w = x.parent.right;
        }

        if (w.left.color === "BLACK" && w.right.color === "BLACK") {
          w.color = "RED";
          x = x.parent;
        } else {
          if (w.right.color === "BLACK") {
            w.left.color = "BLACK";
            w.color = "RED";
            this.rightRotate(w);
            w = x.parent.right;
          }

          w.color = x.parent.color;
          x.parent.color = "BLACK";
          w.right.color = "BLACK";
          this.leftRotate(x.parent);
          x = this.root;
        }
      } else {
        let w = x.parent.left;
        if (w.color === "RED") {
          w.color = "BLACK";
          x.parent.color = "RED";
          this.rightRotate(x.parent);
          w = x.parent.left;
        }

        if (w.left.color === "BLACK" && w.right.color === "BLACK") {
          w.color = "RED";
          x = x.parent;
        } else {
          if (w.left.color === "BLACK") {
            w.right.color = "BLACK";
            w.color = "RED";
            this.leftRotate(w);
            w = x.parent.left;
          }

          w.color = x.parent.color;
          x.parent.color = "BLACK";
          w.left.color = "BLACK";
          this.rightRotate(x.parent);
          x = this.root;
        }
      }
    }
    x.color = "BLACK";
  }

  search(data) {
    return this._search(this.root, data);
  }

  _search(node, data) {
    if (node === this.NIL || data === node.value) {
      return node; // Found or reached a NIL node
    }

    if (data < node.value) {
      return this._search(node.left, data); // Search left subtree
    } else {
      return this._search(node.right, data); // Search right subtree
    }
  }

  // Modify a node's value
  modify(oldValue, newValue) {
    // Search for the node with oldValue
    const node = this.search(oldValue);
    if (node === this.TNULL) {
      console.log("Node not found for modification");
      return;
    }

    // Store the value to be deleted
    const valueToDelete = node.value;

    // Delete the node with oldValue
    this.deleteNode(valueToDelete);

    // Insert the new node with newValue
    this.insert(newValue);
  }

  // Print the tree (in-order traversal)
  inOrderHelper(node) {
    if (node !== this.TNULL) {
      this.inOrderHelper(node.left);
      console.log(`Node: ${node.value}, Color: ${node.color}`);
      this.inOrderHelper(node.right);
    }
  }

  // Public in-order traversal
  inOrderTraversal() {
    this.inOrderHelper(this.root);
  }
}

// Example usage:
let tree = new RedBlackTree();
tree.insert(20);
tree.insert(15);
tree.insert(25);
tree.insert(10);
tree.insert(5);
tree.inOrderTraversal();
console.log("Deleting 15...");
tree.deleteNode(15);
tree.inOrderTraversal();

const result = tree.search(20);
if (result !== tree.NIL) {
  console.log(`Found: ${result.value}`);
} else {
  console.log("Not found");
}

tree.modify(20, 25);

console.log("Tree after modification:");
tree.inOrderTraversal();
