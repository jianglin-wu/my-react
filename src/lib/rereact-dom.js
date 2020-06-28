const ReReactDOM = {};

// 并发模式，允许浏览器中断执行
let nextUnitOfWork = null;
function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    // eslint-disable-next-line no-use-before-define
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  // 当 nextUnitOfWork 为空则表示渲染 fiber 树完成了，
  // 可以提交到 DOM 了
  // eslint-disable-next-line no-use-before-define
  if (!nextUnitOfWork && wipRoot) {
    // eslint-disable-next-line no-use-before-define
    commitRoot();
  }
  requestIdleCallback(workLoop);
}
// 一旦浏览器空闲，就触发执行单元任务
requestIdleCallback(workLoop);


// 创建 DOM 节点
function createDom(fiber) {
  const dom =
    fiber.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(fiber.type);
  const isProperty = (key) => key !== 'children';
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = fiber.props[name];
    });
  return dom;
}


function commitWork(fiber) {
  if (!fiber) {
    return;
  }
  const domParent = fiber.parent.dom;
  domParent.appendChild(fiber.dom);
  // 递归子节点和兄弟节点
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

// 提交根结点到 DOM
let wipRoot = null;
function commitRoot() {
  commitWork(wipRoot.child);
  wipRoot = null;
}


function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
  };
  nextUnitOfWork = wipRoot;
}


function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    // eslint-disable-next-line no-param-reassign
    fiber.dom = createDom(fiber);
  }
  // 子节点 DOM 插到父节点之后
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }
  // 为每个子元素创建新的 fiber
  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;
  while (index < elements.length) {
    const element = elements[index];
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };
    // 根据上面的图示，父节点只链接第一个子节点
    if (index === 0) {
      // eslint-disable-next-line no-param-reassign
      fiber.child = newFiber;
    } else {
      // 兄节点链接弟节点
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    // eslint-disable-next-line no-plusplus
    index++;
  }
  // 返回下一个任务单元（fiber）
  // 有子节点直接返回
  if (fiber.child) {
    return fiber.child;
  }
  // 没有子节点则找兄弟节点，兄弟节点也没有找父节点的兄弟节点，
  // 循环遍历直至找到为止
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
  return null;
}

ReReactDOM.render = render;

export default ReReactDOM;
