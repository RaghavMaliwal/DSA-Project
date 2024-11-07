/* timestring to number */
function toNumber(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;
    return totalMinutes;
  }
  
  class Node {
    constructor(name, start, end, color) {
      this.name = name;
      this.start = start;
      this.end = end;
      this.color = color; // RED or BLACK
      this.left = null;
      this.right = null;
      this.parent = null;
    }
  }
  
  class RedBlackTree {
    constructor() {
      this.TNULL = new Node(null, null, null, "BLACK"); // Sentinel node for leaves
      this.root = this.TNULL;
    }
  
    // Insert a node by event name
    insert(name, start, end) {
      let newNode = new Node(name, start, end, "RED"); // New nodes are red by default
      newNode.left = this.TNULL;
      newNode.right = this.TNULL;
  
      let parent = null;
      let current = this.root;
  
      while (current !== this.TNULL) {
        parent = current;
        if (name.toLowerCase() < current.name.toLowerCase()) {
          current = current.left;
        } else {
          current = current.right;
        }
      }
  
      newNode.parent = parent;
      if (parent === null) {
        this.root = newNode; // The tree was empty
      } else if (name.toLowerCase() < parent.name.toLowerCase()) {
        parent.left = newNode;
      } else {
        parent.right = newNode;
      }
  
      this.balanceInsert(newNode); // Balance the tree
    }
  
    // Search by event name
    search(name) {
      return this._search(this.root, name.toLowerCase());
    }
  
    _search(node, name) {
      if (node === this.TNULL || name === node.name.toLowerCase()) {
        return node; // Found or reached a NIL node
      }
  
      if (name < node.name.toLowerCase()) {
        return this._search(node.left, name); // Search left subtree
      } else {
        return this._search(node.right, name); // Search right subtree
      }
    }
  
    // Balance the tree after insertion (same as in previous implementation)
    balanceInsert(node) {
      let current = node;
      while (current.parent && current.parent.color === "RED") {
        if (current.parent === current.parent.parent.left) {
          let uncle = current.parent.parent.right;
          if (uncle && uncle.color === "RED") {
            current.parent.color = "BLACK";
            uncle.color = "BLACK";
            current.parent.parent.color = "RED";
            current = current.parent.parent;
          } else {
            if (current === current.parent.right) {
              current = current.parent;
              this.leftRotate(current);
            }
            current.parent.color = "BLACK";
            current.parent.parent.color = "RED";
            this.rightRotate(current.parent.parent);
          }
        } else {
          let uncle = current.parent.parent.left;
          if (uncle && uncle.color === "RED") {
            current.parent.color = "BLACK";
            uncle.color = "BLACK";
            current.parent.parent.color = "RED";
            current = current.parent.parent;
          } else {
            if (current === current.parent.left) {
              current = current.parent;
              this.rightRotate(current);
            }
            current.parent.color = "BLACK";
            current.parent.parent.color = "RED";
            this.leftRotate(current.parent.parent);
          }
        }
      }
      this.root.color = "BLACK"; // The root must always be black
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
    
    // Print the tree (in-order traversal)
    inOrderHelper(node) {
      if (node !== this.TNULL) {
        this.inOrderHelper(node.left);
        console.log(
          "Node:" +
            node.name +
            ", Color:" +
            node.color +
            ", Start Time:" +
            node.start
        );
        this.inOrderHelper(node.right);
      }
    }
  
    // Public in-order traversal
    inOrderTraversal() {
      this.inOrderHelper(this.root);
    }
  }
  
  /* MAIN TREE */
  let tree = new RedBlackTree();
  
  // Example usage:
  tree.insert("Meeting", "09:30", "10:30");
  tree.insert("Workshop", "11:00", "12:00");
  tree.insert("Lunch", "12:30", "13:30");
  
  let searchResult = tree.search("Lunch");
  if (searchResult !== tree.TNULL) {
    console.log("Event found:", searchResult.name);
  } else {
    console.log("Event not found");
  }
  