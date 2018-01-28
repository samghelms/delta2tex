import parser from './transitionParser'
import {parserPrep} from './preprocessor'

// const delta = {"ops":[{"insert":{"formula":"\\int x = y"}},{"insert":"  dfdaf "},{"insert":{"formula":"x = y"}},{"insert":" "},{"attributes":{"header":1},"insert":"\n"},{"insert":"\nfdsafasd"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"dfdf"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"fdf"},{"attributes":{"header":1},"insert":"\n"},{"insert":"\n"},{"insert":{"formula":"\\int x"}},{"insert":"\n\n\ndfafds"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"fadsfdsafsda"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"fasdfsad"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"\ndfadsf\n\nfdasfas\nfdf"}]}

// const delta = {"ops":[{"insert":"fadsfsd"},{"attributes":{"code-block":true},"insert":"\n\n\n\n"},{"insert":"fadsfsf"},{"attributes":{"code-block":true},"insert":"\n\n\n"},{"insert":"dfasdf"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"dffd"},{"attributes":{"script":"super"},"insert":"fffdf"},{"insert":"\tfsadfas"},{"attributes":{"header":2},"insert":"\n"},{"insert":"\n\n"}]}

const delta = {"ops":[{"insert":"class Test: "},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"  // takes in 100 and mods it"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"  100 % 6"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"\n"},{"insert":{"formula":"100^6 = 6"}},{"insert":" "},{"attributes":{"header":1},"insert":"\n"},{"insert":"\nThis is the motto for my life\n\n"},{"insert":{"formula":"e = mc^2"}},{"insert":" \n\n\n\n\n\n"}]}

const deltaCleaned = delta["ops"].flatMap(el=>Object.entries(el).flatMap(parserPrep))
deltaCleaned.push(["endfile", ""])
// console.log(deltaCleaned)
// console.log(deltaCleaned[4])
const parsed = parser(deltaCleaned)

const [label, text] = parsed[0]
console.log(text)