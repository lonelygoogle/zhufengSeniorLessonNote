/*
 * 实现一款插件(UI组件)的封装
 *   「样式和结构的处理」
 *      + 在插件内部创建元素的时候，把样式基于“行内样式”写入进去 
 *        + 调用方便
 *        + 不利于样式的提取以及后期的修改(包含用户自定义样式的处理)
 *      + 样式都写入到样式表中，如果不期望用户自己导入样式，我们在JS中动态创建LINK导入样式
 *        + 调用方便
 *        + 样式统一编写，公共样式的提取也都可以做
 *        + 必须要联网，并且导入的样式资源最好部署到CDN上(否则导入速度慢)
 *      + 最好的方案还是用户自己下载下来插件的样式，并且自己手动导入
 * 
 *    样式中尽可能不要出现图片或者其他需要依赖的资源（因为只要出现，都需要用户自己管控好引入的目录及单独下载这些资源）
 *      + 一定需要用到图片，最好图片BASE64
 *      + 需要的其他依赖资源(例如字体图标)最好也都是放在一个目录下
 * 
 *    =============
 * 
 *   「JS的处理：插件/UI组件的核心都在JS」
 *      + 都是基于面向对象思想进行开发：插件本身是一个类，我们可以创建类的实例，调用一次插件相当于创建一个单独的实例，这样实例和实例之间即存在私有的属性方法(保证独立性)，而且也有类原型上的公共方法，并且还可以把类当作对象，提供一些工具类方法...
 *      + 需要考虑DOM结构的处理
 *        + 页面有原始结构，我们只是控制显示隐藏和呈现的内容即可（特点：性能会好一些、但是只能同时存在一个、需要用户自己把结构在页面写好才可以，还要注意结构的位置等...）
 *        + 所有的结构都是基于JS动态创建的（特点：性能不如第一个、但是根据需求自己可以同时创建N个、用起来方便...）
 * 
 *    =============
 *    
 *    封装插件组件的目的：构建敏捷化开发平台的一个重要环节（实现复用「别人愿意用」）
 *      + 易用性
 *        + 调用简单
 *        + 不需要太多的依赖（最好是零依赖）
 *        + 各种容错处理和完善的错误提示
 *        + 详细的说明文档和各种情况的参考DEMO
 *        + ...
 *      + 强大
 *        + 功能强大，项目中常现的效果，基本都可以支持（需要自己项目经验的积累和大量观看别人的插件...）
 *        + 适配更多的需求
 *        + 更多的用户自定义扩展(样式/功能)
 *        + ...
 *      + 升级及向后兼容（学习成本低）
 *      + 高性能（性能优化、轻量级「代码少、体积小」）
 *      + 可维护性（各种设计模式的应用）
 *      + ...
 */