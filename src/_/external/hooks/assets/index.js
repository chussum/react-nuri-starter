import hook from './hook'
import compiler from './compiler'

module.exports = function addHook({ name, extensions, ...options } = {}) {
    extensions = (extensions || []).map((ext) => ext.replace('.', ''));
    extensions.forEach((ext) => hook(`.${ext}`, compiler(name, options)));
};
