export class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}
export class AVLTree {
  constructor() {
    this.root = null;
  }

  getHeight(node) {
    if (node === null) {
      return 0;
    }
    return node.height;
  }
  getBalanceFactor(node) {
    if (node == null) {
      return 0;
    }
    const factor = this.getHeight(node.left) - this.getHeight(node.right);
    return factor;
  }
  _balance(root) {
    this.updateHeight(root);
    const balance = this.getBalanceFactor(root);

    // 1. LL (Правый поворот)
    if (balance > 1 && this.getBalanceFactor(root.left) >= 0) {
      return this.rotateRight(root);
    }

    // 2. RR (Левый поворот)
    if (balance < -1 && this.getBalanceFactor(root.right) <= 0) {
      return this.rotateLeft(root);
    }

    // 3. LR (Левый, затем Правый поворот)
    if (balance > 1 && this.getBalanceFactor(root.left) < 0) {
      root.left = this.rotateLeft(root.left);
      return this.rotateRight(root);
    }

    // 4. RL (Правый, затем Левый поворот)
    if (balance < -1 && this.getBalanceFactor(root.right) > 0) {
      root.right = this.rotateRight(root.right);
      return this.rotateLeft(root);
    }

    return root;
  }
  updateHeight(node) {
    node.height =
      Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
  }
  /**
   * LL левое поддерево слишком высокое
   * @param {Node} Y
   */
  rotateRight(Y) {
    const X = Y.left;
    const T2 = X.right;

    X.right = Y;
    Y.left = T2;
    this.updateHeight(Y);
    this.updateHeight(X);

    return X;
  }
  /**
   * RR правое поддерево слишком высокое
   * @param {Node} Y
   */
  rotateLeft(Y) {
    const X = Y.right;
    const T2 = X.left;

    X.left = Y;
    Y.right = T2;
    this.updateHeight(Y);
    this.updateHeight(X);

    return X;
  }

  insert(value) {
    this.root = this._insert(this.root, value);
  }
  _insert(node, value) {
    if (node == null) {
      return new Node(value);
    }

    if (node.value > value) {
      node.left = this._insert(node.left, value);
    } else {
      node.right = this._insert(node.right, value);
    }

    this.updateHeight(node);
    const balance = this.getBalanceFactor(node);

    // LL
    if (balance > 1 && value < node.left.value) {
      return this.rotateRight(node);
    }

    // RR
    if (balance < -1 && value > node.right.value) {
      return this.rotateLeft(node);
    }

    // LR
    if (balance > 1 && value > node.left.value) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }

    // RL
    if (balance < -1 && value < node.right.value) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }

    return node;
  }
  delete(value) {
    this.root = this._delete(this.root, value);
    return this.root;
  }
  _delete(root, value) {
    if (root == null) return null;

    if (value < root.value) {
      root.left = this._delete(root.left, value);
      return this._balance(root);
    }

    if (value > root.value) {
      root.right = this._delete(root.right, value);
      return this._balance(root);
    }

    if (root.left == null && root.right == null) return null;

    if (root.left == null) return root.right;

    if (root.right == null) return root.left;

    let min = root.right;
    while (min.left != null) {
      min = min.left;
    }
    root.value = min.value;
    root.right = this._delete(root.right, min.value);
    return this._balance(root);
  }

  /**
   * Поиск элемента в дереве с подсчетом шагов.
   * @param {number} value - Искомое значение.
   * @returns {{found: boolean, steps: number}} Объект с результатом.
   */
  search(value) {
    let steps = 0;
    let current = this.root;

    while (current !== null) {
      steps++;
      if (value === current.value) {
        return { found: true, steps: steps };
      } else if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return { found: false, steps: steps };
  }
  /**
   * Симметричный (in-order) обход дерева и возврат списка значений.
   * @returns {number[]} Список значений вершин.
   */
  inOrderTraversal() {
    const result = [];
    const traverse = (node) => {
      if (!node) return;
      traverse(node.left);
      result.push(node.value);
      traverse(node.right);
    };
    traverse(this.root);
    return result;
  }

  // Симметричный обход с колбэком и индексом (для преобразования)
  inOrderWithIndex(callback) {
    let index = 0;
    const traverse = (node) => {
      if (!node) return;
      traverse(node.left);
      callback(node, index++);
      traverse(node.right);
    };
    traverse(this.root);
  }

  // Первое преобразование: модуль и деление на 2 если кратно 4
  applyPrimaryTransform() {
    const transform = (node) => {
      if (!node) return;
      transform(node.left);
      if (node.value < 0) node.value = Math.abs(node.value);
      if (node.value % 4 === 0) node.value = node.value / 2;

      transform(node.right);
    };
    transform(this.root);
  }

  applyIndexTransform() {
    this.inOrderWithIndex((node, i) => {
      node.value = Math.abs(node.value - i);
    });
  }

  transformTree() {
    this.applyPrimaryTransform();
    this.applyIndexTransform();
  }
}
