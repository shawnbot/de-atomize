'use strict';
module.exports = options => {
  const scope = options.scope || {tag: 'body'};
  const criteria = {attrs: {class: true}};

  const entries = [];
  const stack = [];

  const apply = node => {
    const classes = getClasses(node);
    if (classes.length) {
      node.selector = getPartialSelector(node, stack[stack.length - 1]);
      entries.push({
        node: node,
        stack: stack.slice(),
        classes: classes
      });
    }
  };

  const walk = (node, depth) => {
    if (node.tag) {
      apply(node);
      stack.push(node);
      if (node.content) {
        let index = 0;
        node.content.forEach(child => {
          if (child.tag) {
            child.index = index++;
            walk(child, depth + 1);
          }
        });
      }
      stack.pop();
    }
  };

  return tree => {
    return new Promise((resolve, reject) => {
      return tree.match(scope, node => {

        try {
          walk(node, 0);
          const css = entries.map(entry => {
              const classes = getClasses(entry.node);
              const atoms = classes.join(' ');
              if (classes) {
                delete entry.node.attrs.class;
              }
              const selector = getSelector(entry);
              return `${selector} { @include atoms(${atoms}); }`;
            })
            .join('\n');

          node.content.push({
            tag: 'style',
            attrs: {
              type: 'text/scss'
            },
            content: [css]
          });
          resolve(node);
        } catch (error) {
          reject(error);
        }
      });
    });
  };
};

const getClasses = node => {
  return node.attrs && node.attrs.class
    ? node.attrs.class.split(/\s+/).filter(c => c)
    : [];
};

const getSelector = entry => {
  if (entry.stack) {
    const parent = entry.stack[entry.stack.length - 1];
    return entry.stack.concat(entry.node)
      .map(node => node.selector || getPartialSelector(node, parent))
      .join(' > ');
  }
};

const getPartialSelector = (node, parent) => {
  if (node.attrs && node.attrs.as) {
    return node.attrs.as;
  } else if (parent) {
    const siblings = parent.content.filter(n => n.tag);
    if (siblings.length > 1) {
      const sameTag = siblings.filter(n => n.tag === node.tag);
      // if all of the siblings have the same tag, use :nth-child(index)
      if (sameTag.length === siblings.length) {
        let index = siblings.indexOf(node) + 1;
        return node.tag + `:nth-child(${index})`;
      } else if (sameTag.length > 1) {
        let index = sameTag.indexOf(node) + 1;
        return node.tag + `:nth-of-type(${index})`;
      }
    }
  }
  return node.tag;
};
