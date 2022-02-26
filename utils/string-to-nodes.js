export default function stringToNodes(keyword, value) { // 匹配keyword里包含的value返回富文本节点
  const node = []; // [ {}, {} ]格式
  if(keyword.toUpperCase().startsWith(value.toUpperCase())) { // 匹配到的前部关键字
    const key1 = keyword.slice(0, value.length);
    const node1 = { // 创建node节点
      name: "span",
      attrs: { style: " color: #26ce8a; font-size: 14px; " },
      children: [{
        type: "text",
        text: key1
      }]
    }
    node.push(node1);

    const key2 = keyword.slice(value.length);
    const node2 = {
      name: "span",
      attrs: { style: "color: black; font-size: 14px;" },
      children: [{
        type: "text",
        text: key2
      }]
    }
    node.push(node2)
  } else {
    const node3 = {
      name: "span",
      attrs: { style: "color: black; font-size: 14px;" },
      children: [{
        type: "text",
        text: keyword
      }]
    }
    node.push(node3);
  }
  return node;
}