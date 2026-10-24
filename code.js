figma.showUI(__html__, { visible: false });

const targets = [];

function collect(node) {
  if ('fills' in node && node.fills !== figma.mixed) {
    node.fills.forEach((p, i) => {
      if (p.type === 'IMAGE' && p.imageHash) {
        targets.push({ node, index: i, hash: p.imageHash });
      }
    });
  }
  if ('children' in node) node.children.forEach(collect);
}

figma.currentPage.selection.forEach(collect);

if (!targets.length) {
  figma.closePlugin('No image fills found in selection');
}

let done = 0;

figma.ui.onmessage = async (msg) => {
  if (msg.ready) {
    for (let i = 0; i < targets.length; i++) {
      const bytes = await figma.getImageByHash(targets[i].hash).getBytesAsync();
      figma.ui.postMessage({ id: i, bytes });
    }
    return;
  }

  const t = targets[msg.id];
  const newImage = figma.createImage(msg.bytes);
  const fills = [...t.node.fills];
  fills[t.index] = { ...fills[t.index], imageHash: newImage.hash };
  t.node.fills = fills;

  done++;
  if (done === targets.length) figma.closePlugin(`Despilled ${done} image(s)`);
};
