import { test } from 'node:test';
import assert from 'node:assert/strict';
import { discover, publicProject } from '../api/projects.mjs';
const repo = { name:'sample', private:false, visibility:'public', owner:{login:'Metaphysicist1'}, description:'Public description', homepage:'https://example.org', secretNote:'never publish', localPath:'/home/private' };
test('only explicitly public owned projects enter a field allowlist', () => {
 for (const changed of [{private:true},{visibility:'private'},{visibility:undefined},{owner:{login:'other'}},{name:'../private'}]) assert.equal(publicProject({...repo,...changed}),null);
 const result=publicProject(repo);
 assert.equal(result.website,'https://example.org/');
 assert.equal(result.secretNote,undefined); assert.equal(result.localPath,undefined);
 assert.doesNotMatch(JSON.stringify(result),/never publish|\/home\/private/);
});
test('unsafe homepage URLs are excluded', () => {
 for (const homepage of ['javascript:alert(1)','http://example.org','https://user:pass@example.org','https://example.org/?key=secret','https://127.0.0.1/','https://localhost/']) assert.equal(publicProject({...repo,homepage}).website,null);
});
test('discovery paginates without credentials and filters private rows',async () => {
 let calls=0;
 const data=await discover(async (url,options) => {
  calls++;assert.equal(options.headers.Authorization,undefined);assert.match(url,/api.github.com\/users\/Metaphysicist1\/repos/);
  return {ok:true,json:async()=>calls===1?Array.from({length:100},(_,i)=>({...repo,name:`p${i}`})):[{...repo,name:'private',private:true},{...repo,name:'last'}]};
 });
 assert.equal(calls,2);assert.equal(data.projects.length,101);assert.equal(data.projects.at(-1).name,'last');
});
test('upstream failures do not return partial or stale repository lists',async () => {
 await assert.rejects(discover(async()=>({ok:false})),/unavailable/);
});

import { stories } from '../lib/project-stories.mjs';
import { existsSync, readFileSync } from 'node:fs';

test('reviewed projects have real local images, full descriptions, and public provenance', () => {
  assert.equal(Object.keys(stories).length,32);
  for (const [name,story] of Object.entries(stories)) {
    assert.ok(story.description.length > 100,name);
    assert.ok(story.detail.length > 80,name);
    assert.match(story.image,/^\/img\/projects\/[\w.-]+\.jpg$/);
    const image = new URL(`../public${story.image}`,import.meta.url);
    assert.ok(existsSync(image),name);
    const bytes=readFileSync(image);assert.equal(bytes[0],0xff);assert.equal(bytes[1],0xd8);
    assert.match(story.sourceUrl,/^https:\/\/github.com\/Metaphysicist1\//);
    assert.ok(new URL(story.imageSource).protocol==='https:');
    assert.doesNotMatch(JSON.stringify(story),/localhost|127\.0\.0\.1|\/home\/|\.atlas|handoff/);
  }
});
test('curated stories cannot cause private projects to appear', () => {
  const known={...repo,name:'ClipVault'};
  assert.equal(publicProject({...known,private:true}),null);
  assert.equal(publicProject({...known,visibility:'private'}),null);
  assert.equal(publicProject(known).story.title,'ClipVault');
  assert.equal(publicProject({...repo,name:'brand-new-public-project'}).story,null);
});
