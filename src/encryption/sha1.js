/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1-BETA Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */
/*
 * Configurable letiables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
let hexcase = 0 /* hex output format. 0 - lowercase; 1 - uppercase     */
let b64pad = '' /* base-64 pad character. '=' for strict RFC compliance  */
let chrsz = 8 /* bits per input character. 8 - ASCII; 16 - Unicode    */
/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
export function hexSha1 (s) {
  return binb2hex(coresha1(str2binb(s), s.length * chrsz))
}
export function b64sha1 (s) {
  return binb2b64(coresha1(str2binb(s), s.length * chrsz))
}
export function strsha1 (s) {
  return binb2str(coresha1(str2binb(s), s.length * chrsz))
}
export function hexhmacsha1 (key, data) {
  return binb2hex(corehmacsha1(key, data))
}
export function b64hmacsha1 (key, data) {
  return binb2b64(corehmacsha1(key, data))
}
export function strhmacsha1 (key, data) {
  return binb2str(corehmacsha1(key, data))
}
/*
 * Perform a simple self-test to see if the VM is working
 */
export function sha1vmtest () {
  return hexsha1('abc') == 'a9993e364706816aba3e25717850c26c9cd0d89d'
}
/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
export function coresha1 (x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << (24 - len % 32)
  x[((len + 64 >> 9) << 4) + 15] = len
  let w = Array(80)
  let a = 1732584193
  let b = -271733879
  let c = -1732584194
  let d = 271733878
  let e = -1009589776
  for (let i = 0; i < x.length; i += 16) {
    let olda = a
    let oldb = b
    let oldc = c
    let oldd = d
    let olde = e
    for (let j = 0; j < 80; j++) {
      if (j < 16) w[j] = x[i + j]
      else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1)
      let t = safeadd(safeadd(rol(a, 5), sha1ft(j, b, c, d)), safeadd(safeadd(e, w[j]), sha1kt(j)))
      e = d
      d = c
      c = rol(b, 30)
      b = a
      a = t
    }
    a = safeadd(a, olda)
    b = safeadd(b, oldb)
    c = safeadd(c, oldc)
    d = safeadd(d, oldd)
    e = safeadd(e, olde)
  }
  return Array(a, b, c, d, e)
}
/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
export function sha1ft (t, b, c, d) {
  if (t < 20) return (b & c) | ((~b) & d)
  if (t < 40) return b ^ c ^ d
  if (t < 60) return (b & c) | (b & d) | (c & d)
  return b ^ c ^ d
}
/*
 * Determine the appropriate additive constant for the current iteration
 */
export function sha1kt (t) {
  return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514
}
/*
 * Calculate the HMAC-SHA1 of a key and some data
 */
export function corehmacsha1 (key, data) {
  let bkey = str2binb(key)
  if (bkey.length > 16) bkey = coresha1(bkey, key.length * chrsz)
  let ipad = Array(16),
    opad = Array(16)
  for (let i = 0; i < 16; i++) {
    ipad[i] = bkey[i] ^ 0x36363636
    opad[i] = bkey[i] ^ 0x5C5C5C5C
  }
  let hash = coresha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz)
  return coresha1(opad.concat(hash), 512 + 160)
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
export function safeadd (x, y) {
  let lsw = (x & 0xFFFF) + (y & 0xFFFF)
  let msw = (x >> 16) + (y >> 16) + (lsw >> 16)
  return (msw << 16) | (lsw & 0xFFFF)
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */
export function rol (num, cnt) {
  return (num << cnt) | (num >>> (32 - cnt))
}
/*
 * Convert an 8-bit or 16-bit string to an array of big-endian words
 * In 8-bit function, characters >255 have their hi-byte silently ignored.
 */
export function str2binb (str) {
  let bin = Array()
  let mask = (1 << chrsz) - 1
  for (let i = 0; i < str.length * chrsz; i += chrsz)
    bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32)
  return bin
}
/*
 * Convert an array of big-endian words to a string
 */
export function binb2str (bin) {
  let str = ''
  let mask = (1 << chrsz) - 1
  for (let i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i >> 5] >>> (24 - i % 32)) & mask)
  return str
}
/*
 * Convert an array of big-endian words to a hex string.
 */
export function binb2hex (binarray) {
  let hextab = hexcase ? '0123456789ABCDEF' : '0123456789abcdef'
  let str = ''
  for (let i = 0; i < binarray.length * 4; i++) {
    str += hextab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hextab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF)
  }
  return str
}
/*
 * Convert an array of big-endian words to a base-64 string
 */
export function binb2b64 (binarray) {
  let tab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  let str = ''
  for (let i = 0; i < binarray.length * 4; i += 3) {
    let triplet = (((binarray[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16) | (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8) | ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF)
    for (let j = 0; j < 4; j++) {
      if (i * 8 + j * 6 > binarray.length * 32) str += b64pad
      else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F)
    }
  }
  return str
}
