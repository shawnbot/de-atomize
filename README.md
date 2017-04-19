# de-atomize

This is an experiment in using [posthtml] to strip [atomic]/[functional]
classes from HTML and move them to SCSS.

Currently, all it does is remove all class attributes and add a
`<style type="text/scss">` element that outputs all of the unique selectors
with an `atoms()` mixin that gets all of the atomic classes. E.g., given the
[form example] from [Tachyons], it produces:

```
<main>
  <form>
    <fieldset id="sign_up">
      <legend>Sign In</legend>
      <div as=".field-email">
        <label for="email-address">Email</label>
        <input type="email" name="email-address" id="email-address">
      </div>
      <div as=".field-passwd">
        <label for="password">Password</label>
        <input type="password" name="password" id="password">
      </div>
      <label><input type="checkbox"> Remember me</label>
    </fieldset>
    <div>
      <input type="submit" value="Sign in">
    </div>
    <div>
      <a href="#0">Sign up</a>
      <a href="#0">Forgot your password?</a>
    </div>
  </form>
  <style type="text/scss">
    main { @include atoms(pa4 black-80); }
    main > form { @include atoms(measure center); }
    main > form > fieldset { @include atoms(ba b--transparent ph0 mh0); }
    main > form > fieldset > legend { @include atoms(f4 fw6 ph0 mh0); }
    main > form > fieldset > .field-email { @include atoms(mt3); }
    main > form > fieldset > .field-email > label { @include atoms(db fw6 lh-copy f6); }
    main > form > fieldset > .field-email > input { @include atoms(pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100); }
    main > form > fieldset > .field-passwd { @include atoms(mv3); }
    main > form > fieldset > .field-passwd > label { @include atoms(db fw6 lh-copy f6); }
    main > form > fieldset > .field-passwd > input { @include atoms(b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100); }
    main > form > fieldset > label { @include atoms(pa0 ma0 lh-copy f6 pointer); }
    main > form > div > input { @include atoms(b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib); }
    main > form > div:nth-of-type(2) { @include atoms(lh-copy mt3); }
    main > form > div:nth-of-type(2) > a:nth-child(1) { @include atoms(f6 link dim black db); }
    main > form > div:nth-of-type(2) > a:nth-child(2) { @include atoms(f6 link dim black db); }
  </style>
</main>
```

You'll note that I've added the `as="selector"` attribute to some elements,
which tells de-atomize to substitute that selector instead of the element name
at its place in the direct descendent "stack". This is probably not the Right
Thing to do, but it should give you a sense of where my head is at on this.

:v:

[Tachyons]: http://tachyons.io/
[atomic]: https://acss.io/
[form example]: http://tachyons.io/components/forms/sign-up/index.html
[functional]: https://marcelosomers.com/writing/rationalizing-functional-css/
[posthtml]: https://github.com/posthtml/posthtml
