import { AVLTree } from "./logic.js";

const inputInsert = document.getElementById("insert");
const inserButton = document.getElementById("insertB");

inserButton.addEventListener("click", () => {
  const value = parseInt(inputInsert.value);
  if (!isNaN(value)) {
    tree.insert(value);
    update(tree.root);
  }
  console.log(tree);
});

const inputDelete = document.getElementById("delete");
const deleteButton = document.getElementById("deleteB");

deleteButton.addEventListener("click", () => {
  const value = parseInt(inputDelete.value);
  if (!isNaN(value)) {
    tree.delete(value);
    update(tree.root);
  }
  console.log(tree);
});

const inputSearch = document.getElementById("search");
const searchButton = document.getElementById("searchB");

searchButton.addEventListener("click", () => {
  const value = parseInt(inputSearch.value);
  if (!isNaN(value)) {
    const result = tree.search(value);
    if (result.found) {
      alert(`Значение ${value} найдено за ${result.steps} шагов.`);
    } else {
      alert(`Значение ${value} не найдено (${result.steps} шагов).`);
    }
  }
});

const inOrderButton = document.getElementById("inOrderB");
const transformButton = document.getElementById("transformB");

inOrderButton.addEventListener("click", () => {
  const traversalList = tree.inOrderTraversal();
  alert(`Симметричный обход:\n[ ${traversalList.join(", ")} ]`);
});

transformButton.addEventListener("click", () => {
  tree.transformTree();
  update(tree.root);
  alert(`Дерево успешно преобразовано.`);
});

const width = 900;
const height = 900;
const marginX = 0;
const marginY = 0;
const duration = 1400;
const svg = d3
  .select("#tree")
  .attr("viewBox", [0, 0, width, height])
  .style("overflow", "visible");

// Layout дерева
const layout = d3.tree().size([width, height]);

const linkGroup = svg.append("g").attr("class", "links");
const nodeGroup = svg.append("g").attr("class", "nodes");

// Создаем дерево
const tree = new AVLTree();

/**
 * Функция для обновления и анимации дерева
 * @param {AVLTree.root} mainRoot
 */
function update(mainRoot) {
  const root = d3.hierarchy(mainRoot, (d) => [d.left, d.right].filter(Boolean));
  layout(root);

  root.descendants().forEach((d) => {
    if (d.data.px === undefined) {
      d.data.px = d.parent ? d.parent.data.px : d.x;
      d.data.py = d.parent ? d.parent.data.py : d.y;
    }
  });

  // Настраиваем переход
  const t = svg.transition().duration(duration);

  // Генератор кривых
  const linkGenerator = d3
    .linkVertical()
    .x((d) => d.x + marginX)
    .y((d) => d.y + marginY);

  let links = linkGroup
    .selectAll("path")
    .data(root.links(), (d) => d.target.data.value);

  links.exit().transition(t).remove();

  const linkEnter = links
    .enter()
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "#ffffffff")
    .attr("stroke-width", 2)
    .attr("d", (d) => {
      const o = {
        x: d.source.data.px + marginX,
        y: d.source.data.py + marginY,
      };
      return linkGenerator({ source: o, target: o });
    });

  links
    .merge(linkEnter)
    .transition(t)
    .attr("d", (d) => {
      const source = { x: d.source.x + marginX, y: d.source.y + marginY };
      const target = { x: d.target.x + marginX, y: d.target.y + marginY };
      return linkGenerator({ source, target });
    });

  let nodes = nodeGroup
    .selectAll(".node-g")
    .data(root.descendants(), (d) => d.data.value);

  // Анимация исчезновения
  nodes.exit().transition(t).style("opacity", 0).remove();

  const nodeEnter = nodes
    .enter()
    .append("g")
    .attr("class", "node-g")
    .style("opacity", 0)
    .attr(
      "transform",
      (d) => `translate(${d.data.px + marginX},${d.data.py + marginY})`
    );

  // Добавляем круги и текст
  nodeEnter
    .append("circle")
    .attr("r", 20)
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("stroke-width", 1.5);

  nodeEnter
    .append("text")
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle")
    .attr("font-size", 14)
    .attr("fill", "black")
    .text((d) => d.data.value);

  nodes
    .merge(nodeEnter)
    .transition(t)
    .style("opacity", 1)
    .attr("transform", (d) => `translate(${d.x + marginX},${d.y + marginY})`);

  nodes.select("text").text((d) => d.data.value);

  root.descendants().forEach((d) => {
    d.data.px = d.x;
    d.data.py = d.y;
  });
}
