# Bash

## Grep

grep: find patterns.&#x20;

| Switch | Meaning                                 |
| ------ | --------------------------------------- |
| -i     | case insensitive                        |
| \w     | Return whole words  (between \w and \w) |

`grep fail ej_micro.log | grep -iho \w.kjb\w* | awk -F\" '{print $1}' - | sort -u`

* The example above will &#x20;
* look for "fail" in a log-file,&#x20;
* then pipe the results to another grep-command which looks for whole words ending with "kjb".&#x20;
* That result is piped to the awk command which prints the first column.&#x20;
* That result is piped to the sort command, which will print unique values (-u)

## Awk

See [https://en.wikipedia.org/wiki/AWK#Structure\_of\_AWK\_programs](https://en.wikipedia.org/wiki/AWK#Structure\_of\_AWK\_programs)

## Networking Commands

| Command                  | Description                |
| ------------------------ | -------------------------- |
| lsof -PiTCP -sTCP:LISTEN | List used ports on machine |

